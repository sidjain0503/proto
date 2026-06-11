const { validation } = require("../middleware/authValidationMiddleware");
const AIService = require("../services/ai/AIServiceModule");
const { runChat } = require("../services/AIService");

const ai = new AIService();

module.exports = (router) => {
  /**
   * @swagger
   * /ai/chat:
   *   post:
   *     summary: Stream AI chat response
   *     description: Send a prompt to the AI service and receive a streamed response
   *     tags: [AI]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - prompt
   *             properties:
   *               prompt:
   *                 type: string
   *                 description: The user's prompt/question for the AI
   *                 example: "What is machine learning?"
   *               options:
   *                 type: object
   *                 description: Additional options for the AI request
   *                 properties:
   *                   temperature:
   *                     type: number
   *                   max_tokens:
   *                     type: number
   *     responses:
   *       200:
   *         description: Successful response with streamed AI output
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *                 data:
   *                   type: object
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
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
      req.log?.error({ err }, "AI chat stream failed");
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * @swagger
   * /ai/generate:
   *   post:
   *     summary: Generate AI response
   *     description: Generate a non-streamed AI response for the given prompt
   *     tags: [AI]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - prompt
   *             properties:
   *               prompt:
   *                 type: string
   *                 description: The user's prompt/question for the AI
   *                 example: "Explain quantum computing"
   *               options:
   *                 type: object
   *                 description: Additional options for the AI request
   *     responses:
   *       200:
   *         description: Successful response with AI generated content
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *                 data:
   *                   type: object
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  router.post("/ai/generate", validation, async (req, res) => {
    try {
      const result = await runChat(req, res);
      res.json(result);
    } catch (err) {
      req.log?.error({ err }, "AI generate failed");
      res.status(500).json({ error: err.message });
    }
  });
};
