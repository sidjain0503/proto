const Adapter = require("../../Adapter");
const { traceActiveObservation, buildTokenUsageDetails } = require("../../observability/LangfuseTracing");

class StreamingLLMStep {
  async execute(ctx) {
    return traceActiveObservation(
      "llm-generation",
      async (llmGenerationObservation) => {
        const adapter = new Adapter(ctx.provider, ctx.providerOpts);
        let fullText = "";
        let firstTokenSeen = false;

        ctx.writer?.status("generating");

        llmGenerationObservation?.update({
          model: ctx.providerOpts.model,
          input: ctx.messages,
          metadata: { provider: ctx.provider, streaming: true },
        });

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

        llmGenerationObservation?.update({
          output: fullText,
          usageDetails: buildTokenUsageDetails(result.usage),
        });

        ctx.steps.push({
          type: "llm_stream",
          timestamp: Date.now(),
        });

        return {
          type: "final",
          output: fullText,
        };
      },
      { asType: "generation" }
    );
  }
}

module.exports = StreamingLLMStep;
