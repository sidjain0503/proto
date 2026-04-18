const OpenAIProvider = require("./providers/OpenAIProvider");
const OpenRouterProvider = require("./providers/OpenRouterProvider");
const LocalProvider = require("./providers/LocalProvider");

const model_registry = {
  openai: (opts = {}) => new OpenAIProvider(opts),
  deepseek: (opts = {}) => new OpenRouterProvider(opts),
  local: (opts = {}) => new LocalProvider(opts),
};

module.exports = {
    model_registry
}