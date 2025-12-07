const OpenAI = require("openai");
const config = require("../../../config");

class OpenAIProvider {
  constructor({ model = "gpt-4o-mini" } = {}) {
    this.model = model;
    this.client = new OpenAI({
      apiKey: config.OPENAI_API_KEY,
      // other params..
    });
  }

  async generate({ messages, maxTokens = 512, temperature = 0.2 }) {
    const res = await this.client.chat.completions.create({
      model: this.model,
      messages,
      max_tokens: maxTokens,
      temperature,
    });

    return {
      text: res.choices?.[0]?.message?.content || "",
      usage: res.usage,
      model: this.model,
    };
  }

  async stream({ messages, temperature = 0.2 }, onToken) {
    const stream = await this.client.chat.completions.create({
      model: this.model,
      messages,
      temperature,
      stream: true,
    });

    for await (const chunk of stream) {
      const token = chunk.choices?.[0]?.delta?.content || "";
      if (token) onToken(token);
    }
  }
}

module.exports = OpenAIProvider;
