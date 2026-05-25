const RetrievalStep = require("../steps/RetrievalStep");
const StreamingLLMStep = require("../steps/StreamingLLMStep");
const LLMStep = require("../steps/LlmSteps");

class RAGChain {
  constructor({ stream = false, topK = 5 } = {}) {
    this.stream = stream;
    this.topK = topK;
    this._stepIndex = 0;
  }

  init(ctx) {
    if (!ctx.messages.some((m) => m.role === "system")) {
      ctx.addMessage(
        "system",
        "You are a helpful assistant with access to the user's documents."
      );
    }
    this._stepIndex = 0;
  }

  nextStep() {
    this._stepIndex++;

    if (this._stepIndex === 1) {
      return new RetrievalStep({ topK: this.topK });
    }

    if (this._stepIndex === 2) {
      if (this.stream) {
        return new StreamingLLMStep();
      }
      return new LLMStep();
    }

    return null;
  }

  shouldTerminate() {
    return this._stepIndex >= 2;
  }
}

module.exports = RAGChain;
