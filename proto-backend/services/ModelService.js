const { getModel } = require("../data/operations/get");
const { insertModel } = require("../data/operations/insert");
const { updateModel } = require("../data/operations/update");

const createModel = async (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      const modelName = req.params.model;
      const { binaryUUIDFields, ...data } = req.body;

      if (!modelName) {
        return reject({
          code: 400,
          message: "Bad request, model name is required",
        });
      }

      const binaryUUIDFieldsArray = Array.isArray(binaryUUIDFields) 
        ? binaryUUIDFields 
        : binaryUUIDFields 
          ? [binaryUUIDFields] 
          : [];

      const result = await insertModel(
        modelName,
        data,
        modelName,
        binaryUUIDFieldsArray
      );

      resolve({
        code: 200,
        data: result,
        message: `${modelName} created successfully`,
      });
    } catch (err) {
      const statusCode = err.statusCode || 500;
      return reject({
        code: statusCode,
        error: err.message || err,
        message: err.message || "Create Failed",
      });
    }
  });
};

const updateModelById = async (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      const modelName = req.params.model;
      const id = req.params.id || req.body.id;
      const data = req.body;

      if (!modelName) {
        return reject({
          code: 400,
          message: "Bad request, model name is required",
        });
      }

      if (!id) {
        return reject({
          code: 400,
          message: "Bad request, id is required for update",
        });
      }

      const result = await updateModel(modelName, data, id, modelName);

      resolve({
        code: 200,
        data: result,
        message: `${modelName} updated successfully`,
      });
    } catch (err) {
      const statusCode = err.statusCode || 500;
      return reject({
        code: statusCode,
        error: err.message || err,
        message: err.message || "Update Failed",
      });
    }
  });
};

const fetchModel = async (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      const modelName = req.params.model;
      const conditions = req.body.filters
        ? { filters: req.body.filters }
        : {};
      const options = {
        limit: req.body.limit ? parseInt(req.body.limit) : undefined,
        offset: req.body.offset ? parseInt(req.body.offset) : undefined,
        orderBy: req.body.orderBy || undefined,
      };

      if (!modelName) {
        return reject({
          code: 400,
          message: "Bad request, model name is required",
        });
      }

      const result = await getModel(
        modelName,
        conditions,
        options,
      );

      resolve({
        code: 200,
        data: result,
        message: `${modelName} fetched successfully`,
      });
    } catch (err) {
      const statusCode = err.statusCode || 500;
      return reject({
        code: statusCode,
        error: err.message || err,
        message: err.message || "Fetch Failed",
      });
    }
  });
};

module.exports = {
  createModel,
  updateModelById,
  fetchModel,
};
