const { validation } = require("../middleware/authValidationMiddleware");
const AIService  = require("../services/ai/AIServiceModule");


const ai = new AIService();

module.exports = (router) => {
  router.post("/ai/generate", validation,  async (req, res) => {
    try {
      const out = await ai.streamResponse({
        userId: req.user?.id,
        prompt: req.body.prompt,
        options: req.body?.options,
      }, res);
      res.json(out);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });
};
