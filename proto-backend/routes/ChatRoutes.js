const { validation } = require("../middleware/authValidationMiddleware");
const { createSession, sendMessage } = require("../services/ChatService");

module.exports = (router) => {
  /**
   * @swagger
   * /chat/new:
   *   post:
   *     summary: Create a new chat session
   *     description: Creates a new chat session with system prompt initialization
   *     tags: [Chat]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Successful session creation
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: number
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: number
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  router.post("/chat/new", validation, async (req, res) => {
    try {
      const result = await createSession(req, res);
      if (!res.headersSent && result) {
        res.status(result.status).json(result);
      }
    } catch (err) {
      console.error(err);
      if (!res.headersSent) {
        res.status(err.code || 500).json({ error: err.message });
      } else if (!res.writableEnded) {
        res.end();
      }
    }
  });

  /**
   * @swagger
   * /chat/:sessionId/message:
   *   post:
   *     summary: Send a new message
   *     description: Send a new message to the chat session and get AI response (streaming)
   *     tags: [Chat]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: sessionId
   *         required: true
   *         schema:
   *           type: integer
   *         description: The session ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: array
   *             items:
   *               type: object
   *               required:
   *                 - content
   *               properties:
   *                 content:
   *                   type: string
   *                   description: The message content
   *                   example: "Hello, how are you?"
   *     responses:
   *       200:
   *         description: Message sent and response streamed
   *         content:
   *           text/event-stream:
   *             schema:
   *               type: string
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  router.post("/chat/:sessionId/message", validation, async (req, res) => {
    try {
      const result = await sendMessage(
        req.params.sessionId,
        req.body,
        req,
        res
      );
      if (!res.headersSent) {
        res.json(result);
      }
    } catch (err) {
      console.error(err);
      if (!res.headersSent) {
        res.status(err.code || 500).json({ error: err.message });
      } else if (!res.writableEnded) {
        res.end();
      }
    }
  });
};
