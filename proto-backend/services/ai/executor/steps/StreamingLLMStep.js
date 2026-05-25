const Adapter = require("../../Adapter");

class StreamingLLMStep {
  async execute(ctx) {
    const adapter = new Adapter(ctx.provider, ctx.providerOpts);
    let fullText = "";
    let firstTokenSeen = false;

    ctx.writer?.status("generating");

    const result = await adapter.stream(
      {
        messages: ctx.messages,
        maxTokens: ctx.providerOpts.maxTokens,
        temperature: ctx.providerOpts.temperature,
      },
      (token, info) => {
        if (typeof token === "string" && token.length > 0) {
          if (!firstTokenSeen) firstTokenSeen = true;
          fullText += token;
          ctx.writer?.token(token);
        }

        if (info?.usage) {
          ctx.recordLLMUsage({
            model: info.model,
            usage: info.usage,
          });
        }
      }
    );

    ctx.addMessage("assistant", fullText);

    ctx.recordLLMUsage({
      model: result.model,
      usage: result.usage,
      creditsUsed: result.creditsUsed,
    });

    ctx.steps.push({
      type: "llm_stream",
      timestamp: Date.now(),
    });

    return {
      type: "final",
      output: fullText,
    };
  }
}

module.exports = StreamingLLMStep;
