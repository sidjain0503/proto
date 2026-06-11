const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const {
  request,
  app,
  signupUser,
  loginUser,
  createAuthenticatedUser,
  authHeader,
} = require("../helpers");

describe("contract: auth", () => {
  it("signup → login → access token works", async () => {
    const { email, password } = await signupUser();
    const loginResponse = await loginUser({ email, password });

    assert.equal(loginResponse.status, 200);
    assert.ok(loginResponse.body.access_token);
    assert.equal(loginResponse.body.email, email);
  });

  it("GET /users/me returns current user when authenticated", async () => {
    const { token, email } = await createAuthenticatedUser("me");

    const response = await request(app)
      .get("/proto/api/users/me")
      .set(authHeader(token));

    assert.equal(response.status, 200);
    assert.equal(response.body.data.email, email);
    assert.equal(response.body.data.password, undefined);
  });

  it("protected routes return 401 without token", async () => {
    const response = await request(app).get("/proto/api/sessions");

    assert.equal(response.status, 401);
  });

  it("login rejects invalid credentials", async () => {
    const response = await loginUser({
      email: "missing@proto.test",
      password: "wrong-password",
    });

    assert.equal(response.status, 401);
  });
});
