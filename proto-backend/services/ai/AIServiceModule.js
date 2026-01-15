const { insertModel } = require("../../data/operations/insert");
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


  async streamResponse({ userId, prompt, options = {} }, res) {
    const cleanPrompt = this.preprocessPrompt(prompt);
    const messages = this.buildMessages(cleanPrompt);
    let streamedText = "";
    let usageInfo = null;
    let model = "";

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    try {
      const result = await this.adapter.stream(
        { messages, ...options },
        (token, info) => {
          // info may carry usage information as the last chunk
          if (typeof token === "string") {
            streamedText += token;
            res.write(token);
          }
        }
      );
      res.end();

      if (userId) {
       await insertModel("ai_usage", {
          user_id: userId || null,
          model:result?.model,
          tokens_used: result?.promptTokens,
          credits_used: result?.creditsUsed ,
        });
        this.logger.log("AI usage:", {
          user_id: userId || null,
          model:result?.model,
          tokens_used: result?.promptTokens,
          credits_used: result?.creditsUsed ,
        });
      }
    } catch (err) {
      res.end();
      this.logger.error("AI stream error:", err);
    }
  }

}

module.exports = AIService;
