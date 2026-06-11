const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { request, app, createAuthenticatedUser, authHeader } = require("../helpers");

describe("contract: security", () => {
  it("does not expose unauthenticated GET /users", async () => {
    const response = await request(app).get("/proto/api/users");

    assert.equal(response.status, 404);
  });

  it("does not expose generic model CRUD routes", async () => {
    const { token } = await createAuthenticatedUser("security-models");

    const response = await request(app)
      .post("/proto/api/models/users/fetch")
      .set(authHeader(token))
      .send({ filters: {} });

    assert.equal(response.status, 404);
  });

  it("never returns password hashes from /users/me", async () => {
    const { token } = await createAuthenticatedUser("security-password");

    const response = await request(app)
      .get("/proto/api/users/me")
      .set(authHeader(token));

    assert.equal(response.status, 200);
    assert.equal(response.body.data.password, undefined);
  });
});
