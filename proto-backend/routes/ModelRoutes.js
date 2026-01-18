const { validation } = require("../middleware/authValidationMiddleware");
const {
  createModel,
  updateModelById,
  fetchModel,
} = require("../services/ModelService");

module.exports = (router) => {
  /**
   * @swagger
   * /models/{model}:
   *   post:
   *     summary: Create a new model record
   *     description: Create a new record in the specified model/table
   *     tags: [Models]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: model
   *         required: true
   *         schema:
   *           type: string
   *         description: The model/table name
   *         example: "users"
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             description: The data to insert into the model
   *     responses:
   *       200:
   *         description: Model record created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 code:
   *                   type: integer
   *                 data:
   *                   type: object
   *                 message:
   *                   type: string
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  router.post("/models/:model/create", validation, async (req, res, next) => {
    try {
      const result = await createModel(req, res);
      res.status(result.code).json(result.data);
    } catch (error) {
      next(error);
    }
  });

  /**
   * @swagger
   * /models/{model}/{id}:
   *   put:
   *     summary: Update a model record
   *     description: Update an existing record in the specified model/table by ID
   *     tags: [Models]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: model
   *         required: true
   *         schema:
   *           type: string
   *         description: The model/table name
   *         example: "users"
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: The ID of the record to update
   *         example: 1
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             description: The data to update in the model
   *     responses:
   *       200:
   *         description: Model record updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 code:
   *                   type: integer
   *                 data:
   *                   type: object
   *                 message:
   *                   type: string
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  router.put("/models/:model/:id", validation, async (req, res, next) => {
    try {
      const result = await updateModelById(req, res);
      res.status(result.code).json(result.data);
    } catch (error) {
      next(error);
    }
  });

  /**
   * @swagger
   * /models/{model}:
   *   get:
   *     summary: Fetch model records
   *     description: Retrieve records from the specified model/table with optional filtering, pagination, and ordering
   *     tags: [Models]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: model
   *         required: true
   *         schema:
   *           type: string
   *         description: The model/table name
   *         example: "users"
   *       - in: query
   *         name: filters
   *         schema:
   *           type: string
   *         description: JSON string of filter conditions (e.g., '{"email":"user@example.com"}')
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *         description: Maximum number of records to return
   *         example: 10
   *       - in: query
   *         name: offset
   *         schema:
   *           type: integer
   *         description: Number of records to skip
   *         example: 0
   *       - in: query
   *         name: orderBy
   *         schema:
   *           type: string
   *         description: Field to order by
   *         example: "created_at"
   *     responses:
   *       200:
   *         description: Model records fetched successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 code:
   *                   type: integer
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                 message:
   *                   type: string
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  router.get("/models/:model/fetch", validation, async (req, res, next) => {
    try {
      const result = await fetchModel(req, res);
      res.status(result.code).json(result.data);
    } catch (error) {
      next(error);
    }
  });
};
