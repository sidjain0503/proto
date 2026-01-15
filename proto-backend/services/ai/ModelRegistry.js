const OpenAIProvider = require("./providers/OpenAIProvider");
const DeepSeekProvider = require("./providers/DeepSeekProvider");

const model_registry = {
  openai: (opts = {}) => new OpenAIProvider(opts),
  deepseek: (opts = {}) => new DeepSeekProvider(opts),
};

module.exports = {
    model_registry
}