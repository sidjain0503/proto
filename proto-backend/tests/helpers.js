const assert = require("node:assert/strict");
const request = require("supertest");
const app = require("../app");

const uniqueEmail = (label = "user") =>
  `${label}.${Date.now()}.${Math.random().toString(36).slice(2, 8)}@proto.test`;

const signupUser = async ({ name = "Test User", email, password = "password123" } = {}) => {
  const resolvedEmail = email || uniqueEmail("signup");
  const response = await request(app)
    .post("/proto/api/users/signup")
    .send({ name, email: resolvedEmail, password });

  return { response, email: resolvedEmail, password };
};

const loginUser = async ({ email, password = "password123" }) => {
  const response = await request(app)
    .post("/proto/api/users/login")
    .send({ email, password });

  return response;
};

const createAuthenticatedUser = async (label = "user") => {
  const { email, password } = await signupUser({ email: uniqueEmail(label) });
  const loginResponse = await loginUser({ email, password });

  assert.equal(loginResponse.status, 200);
  assert.ok(loginResponse.body.access_token);

  return {
    email,
    password,
    token: loginResponse.body.access_token,
    user: loginResponse.body,
  };
};

const authHeader = (token) => ({ Authorization: `Bearer ${token}` });

const createSession = async (token) => {
  const response = await request(app)
    .post("/proto/api/chat/new")
    .set(authHeader(token))
    .send({});

  assert.equal(response.status, 200);
  assert.ok(response.body.data?.id);

  return response.body.data.id;
};

module.exports = {
  request,
  app,
  uniqueEmail,
  signupUser,
  loginUser,
  createAuthenticatedUser,
  authHeader,
  createSession,
};
