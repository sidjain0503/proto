const { validation } = require("../middleware/authValidationMiddleware");
const AIService = require("../services/ai/AIServiceModule");
const { runChat } = require("../services/AIService");

const ai = new AIService();

module.exports = (router) => {
  router.post("/ai/chat", validation, async (req, res) => {
    try {
      const out = await ai.streamResponse(
        {
          userId: req.user?.id,
          prompt: req.body.prompt,
          options: req.body?.options,
        },
        res
      );
      res.json(out);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  router.post("/ai/generate", validation, async (req, res) => {
    try {
      const result = await runChat(req, res);
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });
};
