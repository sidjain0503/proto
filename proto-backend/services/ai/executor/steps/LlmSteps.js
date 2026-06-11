const Adapter = require("../../Adapter");
const { traceActiveObservation, buildTokenUsageDetails } = require("../../observability/LangfuseTracing");

class LLMStep {
  async execute(ctx) {
    return traceActiveObservation(
      "llm-generation",
      async (llmGenerationObservation) => {
        const adapter = new Adapter(ctx.provider, ctx.providerOpts);

        llmGenerationObservation?.update({
          model: ctx.providerOpts.model,
          input: ctx.messages,
          metadata: { provider: ctx.provider, streaming: false },
        });

        const result = await adapter.generate({
          messages: ctx.messages,
          maxTokens: ctx.providerOpts.maxTokens,
          temperature: ctx.providerOpts.temperature,
        });

        ctx.addMessage("assistant", result.text);

        ctx.recordLLMUsage({
          model: result?.model,
          usage: result?.usage,
        });

        llmGenerationObservation?.update({
          output: result.text,
          usageDetails: buildTokenUsageDetails(result.usage),
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
      },
      { asType: "generation" }
    );
  }
}

module.exports = LLMStep;
