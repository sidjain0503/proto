const { getAll } = require("../data/operations/get");
const { insertModel } = require("../data/operations/insert");
const { updateModel } = require("../data/operations/update");

const getAllUsers = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allusers = await getAll("users");

      resolve({
        code: 200,
        data: allusers,
      });
    } catch (err) {
      return reject({
        code: 500,
        error: err,
      });
    }
  });
};

const signupUser = async (reqBody) => {
  return new Promise(async (resolve, reject) => {
    try {
      await insertModel("users", reqBody, "user");

      resolve({
        code: 200,
        data: "User Added Successfully",
      });
    } catch (err) {
      const statusCode = err.statusCode || 500;
      return reject({
        code: statusCode,
        error: err.message || err,
        message: err.message || "Signup Failed",
      });
    }
  });
};

const updateUser = async (reqBody) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { id } = reqBody;
      if (!id) {
        return reject({
          code: 400,
          message: "Bad request id not provided",
        });
      }
      await updateModel("users", reqBody, reqBody.id, "user");

      resolve({
        code: 200,
        data: "User Updated Successfully",
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

module.exports = {
  getAllUsers,
  signupUser,
  updateUser,
};
