const { validation } = require("../middleware/authValidationMiddleware");
const {
  getAllUsers,
  signupUser,
  updateUser,
  loginUser,
} = require("../services/UserService");

module.exports = (router) => {
  /**
   * @swagger
   * /users/signup:
   *   post:
   *     summary: Register a new user
   *     description: Create a new user account
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 description: User's email address
   *                 example: "user@example.com"
   *               password:
   *                 type: string
   *                 format: password
   *                 description: User's password
   *                 example: "SecurePassword123!"
   *               name:
   *                 type: string
   *                 description: User's full name
   *                 example: "John Doe"
   *     responses:
   *       201:
   *         description: User successfully created
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
   *                   properties:
   *                     user:
   *                       type: object
   *                     token:
   *                       type: string
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  router.post("/users/signup", async (req, res, next) => {
    try {
      const result = await signupUser(req.body);
      res.status(result.code).json(result.data);
    } catch (error) {
      next(error);
    }
  });

  /**
   * @swagger
   * /users/login:
   *   post:
   *     summary: User login
   *     description: Authenticate user and return JWT token
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 description: User's email address
   *                 example: "user@example.com"
   *               password:
   *                 type: string
   *                 format: password
   *                 description: User's password
   *                 example: "SecurePassword123!"
   *     responses:
   *       200:
   *         description: Login successful
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
   *                   properties:
   *                     user:
   *                       type: object
   *                     token:
   *                       type: string
   *                       description: JWT authentication token
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  router.post("/users/login", async (req, res, next) => {
    try {
      const result = await loginUser(req.body);
      res.status(result.code).json(result.data);
    } catch (error) {
      next(error);
    }
  });


  /**
   * @swagger
   * /users:
   *   get:
   *     summary: Get all users
   *     description: Retrieve a list of all users (requires authentication)
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of users retrieved successfully
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
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: integer
   *                       email:
   *                         type: string
   *                       name:
   *                         type: string
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  router.get("/users", async (req, res, next) => {
    try {
      const result = await getAllUsers();
      res.status(result.code).json(result.data);
    } catch (error) {
      next(error);
    }
  });
};
