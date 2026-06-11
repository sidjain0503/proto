const { validation } = require("../middleware/authValidationMiddleware");
const { authRateLimiter } = require("../middleware/rateLimitMiddleware");
const { getCurrentUser, signupUser, loginUser } = require("../services/UserService");

module.exports = (router) => {
  router.post("/users/signup", authRateLimiter, async (req, res, next) => {
    try {
      const result = await signupUser(req.body);
      res.status(result.code).json(result.data);
    } catch (error) {
      next(error);
    }
  });

  router.post("/users/login", authRateLimiter, async (req, res, next) => {
    try {
      const result = await loginUser(req.body);
      res.status(result.code).json(result.data);
    } catch (error) {
      next(error);
    }
  });

  router.get("/users/me", validation, async (req, res, next) => {
    try {
      const user = await getCurrentUser(req.user.id);
      res.status(200).json({ code: 200, data: user });
    } catch (error) {
      next(error);
    }
  });
};
