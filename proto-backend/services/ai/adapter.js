const OpenAIProvider = require("./providers/OpenAIProvider");
const DeepSeekProvider = require("./providers/DeepSeekProvider");

const model_registry = {
  openai: (opts = {}) => new OpenAIProvider(opts),
  deepseek: (opts = {}) => new DeepSeekProvider(opts),
};

class Adapter {
  constructor(providerName = "openai", providerOpts = {}) {
    // console.log('Default ',providerName, providerOpts)
    this.provider = model_registry[providerName](providerOpts);
  }

  async generate(request) {
    const result = await this.provider.generate(request);
    return {
      text: result.text,
      usage: result.usage,
      model: result.model,
    };
  }

  async stream(request, onToken) {
    return this.provider.stream(request, onToken);
  }
}

module.exports = Adapter;
