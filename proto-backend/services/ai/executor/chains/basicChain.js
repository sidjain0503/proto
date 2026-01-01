const LLMStep = require("../steps/llmSteps");
const StreamingLLMStep = require("../steps/streamingLLMStep");


class BasicChatChain {
    constructor({ stream = false, res = null } = {}) {
        this.stream = stream;
        this.res = res;
      }  
    
  init(ctx) { // dependent on the execution context
    if (!ctx.messages.some(m => m.role === "system")) {
      ctx.addMessage(
        "system",
        "You are a helpful assistant. Answer clearly and concisely."
      );
    }
  }

  nextStep() {
    if (this.stream) {
      return new StreamingLLMStep({ res: this.res });
    }
    return new LLMStep();
  }

  shouldTerminate() {
    return true; // single-step chain
  }
}

module.exports = BasicChatChain;
