const Adapter = require("./Adapter");

class AIService {
  constructor({ logger = console } = {}) {
    this.logger = logger;
    this.adapter = new Adapter("deepseek", {
      model: "deepseek/deepseek-r1-0528:free",
    });
  }

  preprocessPrompt(prompt) {
    return prompt.trim();
  }

  buildMessages(prompt) {
    return [{ role: "user", content: prompt }];
  }

  async generateResponse({ userId, prompt, options = {} }) {
    const cleanPrompt = this.preprocessPrompt(prompt);
    const messages = this.buildMessages(cleanPrompt);

    const result = await this.adapter.generate({
      messages,
      ...options,
    });

    return result;
  }

  async streamResponse({ prompt, options = {} }, res) {
    const cleanPrompt = this.preprocessPrompt(prompt);
    const messages = this.buildMessages(cleanPrompt);

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");

    await this.adapter.stream({ messages, ...options }, (token) => {
      res.write(`data: ${token}\n\n`);
    });

    res.write(`data: [DONE]\n\n`);
    res.end();
  }
}

module.exports = AIService;
