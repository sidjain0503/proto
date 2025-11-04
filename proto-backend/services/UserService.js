const { getModel } = require("../data/operations/get");
const { insertModel } = require("../data/operations/insert");
const { updateModel } = require("../data/operations/update");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config");

const getAllUsers = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allusers = await getModel("users");

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
      const { name, email, password } = reqBody;

      if (!name || !email || !password) {
        return reject({
          code: 400,
          message: "Bad request, Please provide correct credentials",
        });
      }

      const userExists = await getModel("users", { filters: { email: email } });

      if (userExists.length) {
        return reject({
          code: 500,
          message: "User already registered",
        });
      }

      const salt = await bcrypt.genSalt(10); // 10 = number of salt rounds
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = {
        name,
        email,
        password: hashedPassword,
      };

      await insertModel("users", newUser, "user");

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

const loginUser = async (reqBody) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { email, password } = reqBody;

      if (!email || !password) {
        return reject({
          code: 400,
          message: "Bad request, Please provide correct credentials",
        });
      }

      let _user = await getModel("users", { filters: { email: email } });

      if (!_user.length) {
        return reject({
          code: 500,
          message: "User does not exists",
        });
      }
      _user = _user[0];
      const isValidPassword = await bcrypt.compare(password, _user.password);

      if (!isValidPassword) {
        return reject({
          code: 401,
          message: "Login Failed",
        });
      }

      const _token = {
        email: _user.email,
        name: _user.name,
        id: _user.id,
      };
      _token.TokenString = jwt.sign(_token, config.AUTH_TOKEN_SECRET, {
        expiresIn: config.AUTH_TOKEN_LIFE,
        algorithm: "HS256",
      });

      resolve({
        code: 200,
        data: _token,
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
  loginUser,
};
