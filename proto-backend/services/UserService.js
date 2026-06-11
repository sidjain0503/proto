const { getModel } = require("../data/operations/get");
const { insertModel } = require("../data/operations/insert");
const { updateModel } = require("../data/operations/update");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config");

const getCurrentUser = async (userId) => {
  const users = await getModel("users", {
    filters: { id: userId },
    select: "id,name,email,created_at",
  });

  if (!users.length) {
    throw Object.assign(new Error("User not found"), { code: 404 });
  }

  return users[0];
};

const signupUser = async (reqBody) => {
  const { name, email, password } = reqBody;

  if (!name || !email || !password) {
    throw Object.assign(
      new Error("Bad request, Please provide correct credentials"),
      { code: 400 }
    );
  }

  const userExists = await getModel("users", {
    filters: { email },
    select: "id",
  });

  if (userExists.length) {
    throw Object.assign(new Error("User already registered"), { code: 409 });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  await insertModel(
    "users",
    { name, email, password: hashedPassword },
    "user"
  );

  return { code: 201, data: { message: "User Added Successfully" } };
};

const loginUser = async (reqBody) => {
  const { email, password } = reqBody;

  if (!email || !password) {
    throw Object.assign(
      new Error("Bad request, Please provide correct credentials"),
      { code: 400 }
    );
  }

  const rows = await getModel("users", {
    filters: { email },
    select: "id,name,email,password",
  });

  if (!rows.length) {
    throw Object.assign(new Error("Invalid email or password"), { code: 401 });
  }

  const user = rows[0];
  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    throw Object.assign(new Error("Invalid email or password"), { code: 401 });
  }

  const tokenPayload = {
    email: user.email,
    name: user.name,
    id: user.id,
  };

  const access_token = jwt.sign(tokenPayload, config.AUTH_TOKEN_SECRET, {
    expiresIn: config.AUTH_TOKEN_LIFE,
    algorithm: "HS256",
  });

  return {
    code: 200,
    data: { ...tokenPayload, access_token },
  };
};

module.exports = {
  getCurrentUser,
  signupUser,
  loginUser,
};
