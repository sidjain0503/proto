class ExecutionContext {
    constructor({ userId = null, messages = [], provider = "openai", providerOpts = {} } = {}) {
      this.messages = messages; 
      this.userId = userId;
      this.provider = provider;
      this.providerOpts = providerOpts;
  
      this.steps = [];
      this.totalTokens = 0;
      this.totalCost = 0;
      this.usage = {
        model: null,
        tokens: 0,
      };
  
      this.createdAt = Date.now();

      // console.log("ExecutionContext", this.messages, this.userId, this.provider, this.providerOpts);
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
  
