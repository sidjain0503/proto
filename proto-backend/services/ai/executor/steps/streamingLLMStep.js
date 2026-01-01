// src/ai/steps/streamingLLMStep.js

const Adapter = require("../../Adapter");

class StreamingLLMStep {
  constructor({ res }) {
    this.res = res;
  }

  async execute(ctx) {
    const adapter = new Adapter(ctx.provider, ctx.providerOpts);
    let fullText = "";

    // Log the start of the step
    console.log("StreamingLLMStep: Starting execution with provider:", ctx.provider);

    const result = await adapter.stream(
      { messages: ctx.messages },
      (token, info) => {
        if (typeof token === "string") {
          fullText += token;
          this.res.write(token); // 👈 stream to frontend
        }

        // some providers send usage info at the end
        if (info?.usage) {
          ctx.recordLLMUsage({
            model: info.model,
            usage: info.usage,
          });
          // Log usage info received during streaming
          console.log("StreamingLLMStep: Received usage info during streaming:", info.usage);
        }
      }
    );

    this.res.end();

    ctx.addMessage("assistant", fullText);

    ctx.recordLLMUsage({
      model: result.model,
      usage: result.usage,
      creditsUsed: result.creditsUsed,
    });

    // Also log the step entry that will be pushed to ctx.steps
    const stepEntry = {
      type: "llm_stream",
      timestamp: Date.now(),
    };
    console.log("StreamingLLMStep: Logging step:", stepEntry);

    ctx.steps.push(stepEntry);

    // Log completion
    console.log("StreamingLLMStep: Execution completed. Full output length:", fullText.length);

    return {
      type: "final",
      output: fullText,
    };
  }
}

module.exports = StreamingLLMStep;
