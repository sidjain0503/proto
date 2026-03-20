const OpenAIProvider = require("./providers/OpenAIProvider");
const OpenRouterProvider = require("./providers/OpenRouterProvider");

const model_registry = {
  openai: (opts = {}) => new OpenAIProvider(opts),
  deepseek: (opts = {}) => new OpenRouterProvider(opts),
};

module.exports = {
    model_registry
}