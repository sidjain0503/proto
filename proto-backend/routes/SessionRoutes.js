const { validation } = require("../middleware/authValidationMiddleware");
const {
  listSessionsForUser,
  getMessagesForSession,
} = require("../services/SessionService");

module.exports = (router) => {
  /**
   * @swagger
   * /sessions:
   *   get:
   *     summary: List chat sessions for the current user
   *     tags: [Sessions]
   *     security:
   *       - bearerAuth: []
   */
  router.get("/sessions", validation, async (req, res, next) => {
    try {
      const sessions = await listSessionsForUser(req.user.id);
      res.json({ code: 200, data: sessions });
    } catch (error) {
      next(error);
    }
  });

  /**
   * @swagger
   * /sessions/{sessionId}/messages:
   *   get:
   *     summary: Get messages for a session owned by the current user
   *     tags: [Sessions]
   *     security:
   *       - bearerAuth: []
   */
  router.get("/sessions/:sessionId/messages", validation, async (req, res, next) => {
    try {
      const messages = await getMessagesForSession(
        req.params.sessionId,
        req.user.id
      );
      res.json({ code: 200, data: messages });
    } catch (error) {
      if (error.code === 404) {
        return res.status(404).json({ error: error.message });
      }
      next(error);
    }
  });
};
