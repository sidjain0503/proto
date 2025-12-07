const AIService  = require("../services/ai/AIService");


const ai = new AIService();

module.exports = (router) => {
  router.post("/generate", async (req, res) => {
    try {
      const out = await ai.generateResponse({
        userId: req.user?.id,
        prompt: req.body.prompt,
        options: req.body?.options,
      });
      res.json(out);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });
};
