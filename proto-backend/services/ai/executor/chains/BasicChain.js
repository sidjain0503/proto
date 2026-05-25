const LLMStep = require("../steps/LlmSteps");
const StreamingLLMStep = require("../steps/StreamingLLMStep");

class BasicChatChain {
  constructor({ stream = false } = {}) {
    this.stream = stream;
  }

  init(ctx) {
    if (!ctx.messages.some((m) => m.role === "system")) {
      ctx.addMessage(
        "system",
        "You are a helpful assistant. Answer clearly and concisely."
      );
    }
  }

  nextStep() {
    if (this.stream) {
      return new StreamingLLMStep();
    }
    return new LLMStep();
  }

  shouldTerminate() {
    return true;
  }
}

module.exports = BasicChatChain;
