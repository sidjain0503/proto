const { model_registry } = require("./model_registry");


class Adapter {
  constructor(providerName = "openai", providerOpts = {}) {
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
