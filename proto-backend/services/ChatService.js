const { getModel } = require("../data/operations/get");
const { insertModel } = require("../data/operations/insert");
const { updateModel } = require("../data/operations/update");
const { assertSessionOwnership } = require("./SessionService");
const appConfig = require("../lib/appConfig");
const { createLogger } = require("../lib/logger");

const log = createLogger("chat");
const Adapter = require("./ai/Adapter");
const ExecutionContext = require("./ai/executor/aicontext/ExecutionContext");
const BasicChatChain = require("./ai/executor/chains/BasicChain");
const RAGChain = require("./ai/executor/chains/RAGChain");
const ChainRunner = require("./ai/executor/chains/ChainRunner");
const StreamWriter = require("./ai/StreamWriter");
const {
  propagateTraceAttributes,
  traceActiveObservation,
  buildTokenUsageDetails,
} = require("./ai/observability/LangfuseTracing");

function autoGenerateSessionTitle({ messages, sessionId, req }) {
  (async () => {
    try {
      const firstUserMsg = messages.find(m => m.role === "user");
      const firstAssistantMsg = messages.find(m => m.role === "assistant");

      const session = await getModel("session", {
        filters: { id: sessionId },
        select: "id,title"
      });

      if (
        session[0] &&
        (!session[0].title || session[0].title === "New Chat") &&
        firstUserMsg &&
        firstAssistantMsg
      ) {
        const simpleCtx = new ExecutionContext({
          userId: req.user.id,
          messages: [
            {
              role: "system",
              content:
                "Summarize the following user message in 3-6 words for use as a chat title.",
            },
            { role: "user", content: firstUserMsg.content },
          ],
          provider: appConfig.ai.defaultProvider,
          providerOpts: {
            model: appConfig.ai.defaultModel,
          },
        });

        const adapter = new Adapter(simpleCtx.provider, simpleCtx.providerOpts);
        try {
          const summaryResp = await traceActiveObservation(
            "session-title-generation",
            async (titleGenerationObservation) => {
              titleGenerationObservation?.update({
                model: simpleCtx.providerOpts.model,
                input: simpleCtx.messages,
                metadata: { provider: simpleCtx.provider },
              });

              const response = await adapter.generate({
                messages: simpleCtx.messages,
              });

              titleGenerationObservation?.update({
                output: response.text,
                usageDetails: buildTokenUsageDetails(response.usage),
              });

              return response;
            },
            { asType: "generation" }
          );
          let summary = summaryResp.text || "";
          if (summary) {
            summary = summary
              .replace(/[\r\n]+/g, " ")
              .replace(/^["']|["']$/g, "")
              .trim();
            await updateModel("session", { title: summary }, sessionId);
          }
        } catch (e) {
          log.warn({ err: e, sessionId }, "Session title generation failed");
        }
      }
    } catch (e) {
      log.warn({ err: e, sessionId }, "Session title background task failed");
    }
  })();
}

const insertNewSession = async (req) => {
  const newSession = await insertModel(
    "session",
    { title: "New Chat", user_id: req.user.id },
    null,
    ["id"]
  );

  if (newSession.id) {
    await insertModel(
      "message",
      {
        session_id: newSession.id,
        content: "You are a helpful assistant.",
        role: "System",
      },
      "message"
    );
  }

  return newSession.id;
};

const createSession = async (req, res) => {
  const sessionId = await insertNewSession(req);
  const body = req.body;
  const content = Array.isArray(body) ? body[0]?.content : body?.content;

  if (content && res) {
    return sendMessage(
      sessionId,
      Array.isArray(body) ? body : [{ content }],
      req,
      res,
      { isNewSession: true }
    );
  }

  return {
    status: 200,
    data: { id: sessionId },
  };
};

const sendMessage = async (sessionId, reqBody, req, res, options = {}) => {
  const { isNewSession = false } = options;

  try {
    const { content } = reqBody[0];

    if (!content || !sessionId) {
      throw { code: 400, message: "Bad request" };
    }

    await assertSessionOwnership(sessionId, req.user.id);

    res.setHeader("Content-Type", "application/x-ndjson");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.setHeader("X-Session-Id", String(sessionId));
    if (isNewSession) {
      res.setHeader("X-New-Session", "1");
    }
    res.flushHeaders();

    const writer = new StreamWriter(res);

    const [messages, userDocs] = await Promise.all([
      getModel("message", {
        filters: { session_id: sessionId },
        select: "role,content",
      }),
      getModel("document", {
        filters: { user_id: req.user.id, status: "ready" },
        select: "id",
      }),
    ]);

    const userInsertPromise = insertModel(
      "message",
      { session_id: sessionId, content, role: "user" },
      "message"
    ).catch((e) => {
      log.error({ err: e, sessionId }, "Failed to persist user message");
    });

    const ctx = new ExecutionContext({
      userId: req.user.id,
      messages,
      provider: appConfig.ai.defaultProvider,
      providerOpts: { model: appConfig.ai.defaultModel },
      writer,
    });
    ctx.addMessage("user", content);

    const chain =
      userDocs.length > 0
        ? new RAGChain({ stream: true, topK: appConfig.ai.rag.topK })
        : new BasicChatChain({ stream: true });

    const runner = new ChainRunner();
    const chainType = userDocs.length > 0 ? "rag" : "basic";

    const result = await propagateTraceAttributes(
      {
        userId: String(req.user.id),
        sessionId: String(sessionId),
        tags: [chainType],
      },
      () =>
        traceActiveObservation(
          "chat-request",
          async (chatRequestObservation) => {
            chatRequestObservation?.update({
              input: { content, chain: chainType },
              metadata: {
                provider: ctx.provider,
                model: ctx.providerOpts.model,
              },
            });

            const chainResult = await runner.run(chain, ctx);

            chatRequestObservation?.update({
              output: chainResult.output,
              metadata: {
                sourcesCount: ctx.retrievalResults?.length || 0,
                totalTokens: ctx.usage?.tokens || 0,
              },
            });

            return chainResult;
          },
          { asType: "chain" }
        )
    );

    await userInsertPromise;

    let sources = [];
    if (result && result.output) {
      const metadata = ctx.retrievalResults?.length
        ? {
            sources: ctx.retrievalResults.map((r) => ({
              documentId: r.documentId,
              documentTitle: r.documentTitle,
              filename: r.filename,
              chunkIndex: r.chunkIndex,
              score: r.score,
              preview: r.content.slice(0, 200),
            })),
          }
        : null;
      sources = metadata?.sources || [];

      await insertModel(
        "message",
        {
          session_id: sessionId,
          content: result.output,
          role: "assistant",
          metadata: metadata ? JSON.stringify(metadata) : null,
        },
        "message"
      );
    }

    writer.done({ sources });

    if (!res.writableEnded) res.end();

    autoGenerateSessionTitle({ messages, sessionId, req });

    return {
      status: 200,
      data: { message: "Message sent and stored successfully" },
    };
  } catch (error) {
    log.error({ err: error, sessionId }, "Chat message failed");
    if (res.headersSent) {
      try {
        new StreamWriter(res).error(error.message || "Internal error");
      } catch {}
      if (!res.writableEnded) res.end();
    }
    throw {
      code: error.code || 500,
      message: error.message || "Internal error",
    };
  }
};

module.exports = { createSession, sendMessage };
