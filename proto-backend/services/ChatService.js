const { getModel } = require("../data/operations/get");
const { insertModel } = require("../data/operations/insert");
const { updateModel } = require("../data/operations/update");
const Adapter = require("./ai/Adapter");
const ExecutionContext = require("./ai/executor/aicontext/ExecutionContext");
const BasicChatChain = require("./ai/executor/chains/BasicChain");
const RAGChain = require("./ai/executor/chains/RAGChain");
const ChainRunner = require("./ai/executor/chains/ChainRunner");

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
          provider: "deepseek",
          providerOpts: {
            model: "google/gemini-3.1-flash-lite-preview",
          },
        });

        const adapter = new Adapter(simpleCtx.provider, simpleCtx.providerOpts);
        try {
          const summaryResp = await adapter.generate({
            messages: simpleCtx.messages,
          });
          let summary = summaryResp.text || "";
          if (summary) {
            summary = summary
              .replace(/[\r\n]+/g, " ")
              .replace(/^["']|["']$/g, "")
              .trim();
            await updateModel("session", { title: summary }, sessionId);
          }
        } catch (e) {
          console.log("Error summarizing for title:", e.message);
        }
      }
    } catch (e) {
      console.log("Error in autoGenerateSessionTitle background task:", e.message);
    }
  })();
}

const createSession = async (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const newSession = await insertModel(
        "session",
        { title: "New Chat", user_id: req.user.id },
        null,
        ["id"]
      );

      if (newSession.id) {
        const messageBody = {
          session_id: newSession.id,
          content: "You are a helpful assistant.",
          role: "System",
        };
        await insertModel("message", { ...messageBody }, "message");
      }


      resolve({
        status: 200,
        data: { id: newSession.id },
      });
    } catch (error) {
      console.log("Error in creating session:", error.message);
      reject({
        code: 500,
        message: error.message,
      });
    }
  });
};

const sendMessage = async (sessionId, reqBody, req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { content } = reqBody[0];

      if (!content || !sessionId) {
        return reject({
          code: 400,
          message: "Bad request",
        });
      }

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const messages = await getModel("message", {
        filters: { session_id: sessionId },
        select: "role,content",
      });

    autoGenerateSessionTitle({ messages, sessionId, req });

      const ctx = new ExecutionContext({
        userId: req.user.id,
        messages: messages,
        provider: "deepseek",
        providerOpts: {
          model: "google/gemini-3.1-flash-lite-preview",
        },
      });

      ctx.addMessage("user", content);

      await insertModel(
        "message",
        {
          session_id: sessionId,
          content: content,
          role: "user",
        },
        "message"
      );

      // Check if user has any ready documents → use RAG chain
      const userDocs = await getModel("document", {
        filters: { user_id: req.user.id, status: "ready" },
        select: "id",
      });

      let chain;
      if (userDocs.length > 0) {
        chain = new RAGChain({ stream: true, res, topK: 5 });
        console.log(`[RAG] Using RAGChain (${userDocs.length} docs available)`);
      } else {
        chain = new BasicChatChain({ stream: true, res });
      }

      const runner = new ChainRunner();
      const result = await runner.run(chain, ctx);

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

      resolve({
        status: 200,
        data: { message: "Message sent and stored successfully" },
      });
    } catch (error) {
      console.log("Error in sending message:", error.message);
      if (!res.headersSent) {
        res.setHeader("Content-Type", "application/json");
      }
      if (!res.writableEnded) {
        res.end();
      }
      reject({
        code: 500,
        message: error.message,
      });
    }
  });
};

module.exports = { createSession, sendMessage };
