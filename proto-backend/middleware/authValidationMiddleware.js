const config = require("../config");
const jwt = require('jsonwebtoken')

const _getToken = (req) => {
  try {
    const reqToken = req.headers.authorization
      ? req.headers.authorization.split(" ")[1]
      : "";
    if (!reqToken) {
      return "";
    }
    const user = jwt.verify(reqToken, config.AUTH_TOKEN_SECRET, {
      algorithms: ["HS256"],
    });
    user.token = reqToken;
    return user;
  } catch (err) {
    console.log("Error in _getToken", err);
    return null;
  }
};

const validation = async (req, res, next) => {
  const user = _getToken(req);
  if (!user) {
    return next({
      code: 401,
      message: "Invalid token",
    });
  }
  req.user = user;
  next();
};

module.exports = {
  validation,
  _getToken,
};
