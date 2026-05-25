class ExecutionContext {
    constructor({ userId = null, messages = [], provider = "openai", providerOpts = {}, writer = null } = {}) {
      this.messages = messages;
      this.userId = userId;
      this.provider = provider;
      this.providerOpts = providerOpts;
      this.writer = writer;

      this.steps = [];
      this.totalTokens = 0;
      this.totalCost = 0;
      this.usage = {
        model: null,
        tokens: 0,
      };
      this.retrievalResults = [];

      this.createdAt = Date.now();
    }
  
    addMessage(role, content) {
      this.messages.push({ role, content });
    }
  
    recordLLMUsage({ model, usage }) {
      this.usage.model = model;
      this.usage.tokens += usage?.total_tokens || 0;
    }
  }
  
  module.exports = ExecutionContext;
  
