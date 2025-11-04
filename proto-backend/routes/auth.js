const { validation } = require("../middleware/authValidationMiddleware");
const {
  getAllUsers,
  signupUser,
  updateUser,
  loginUser,
} = require("../services/UserService");

module.exports = (router) => {
  router.post("/users/signup", async (req, res, next) => {
    try {
      const result = await signupUser(req.body);
      res.status(result.code).json(result.data);
    } catch (error) {
      next(error);
    }
  });

  router.post("/users/login", async (req, res, next) => {
    try {
      const result = await loginUser(req.body);
      res.status(result.code).json(result.data);
    } catch (error) {
      next(error);
    }
  });


  router.get("/users",validation, async (req, res, next) => {
    try {
      const result = await getAllUsers();
      res.status(result.code).json(result.data);
    } catch (error) {
      next(error);
    }
  });
};
