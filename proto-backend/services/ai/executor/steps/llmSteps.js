const Adapter = require("../../Adapter");

class LLMStep {
  async execute(ctx) {
    const adapter = new Adapter(ctx.provider, ctx.providerOpts);

    const result = await adapter.generate({
      messages: ctx.messages,
    });

    ctx.addMessage("assistant", result.text);

    ctx.recordLLMUsage({
      model: result?.model,
      usage: result?.usage,
    });

    ctx.steps.push({
      type: "llm",
      model: result?.model || ctx.provider,
      usage: result?.usage,
      outputPreview: result.text.slice(0, 100),
      timestamp: Date.now(),
    });

    return {
      type: "final",
      output: result.text,
    };
  }
}

module.exports = LLMStep;
