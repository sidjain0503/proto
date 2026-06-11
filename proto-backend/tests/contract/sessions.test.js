const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const {
  request,
  app,
  createAuthenticatedUser,
  authHeader,
  createSession,
} = require("../helpers");

describe("contract: sessions", () => {
  it("lists sessions for authenticated user", async () => {
    const { token } = await createAuthenticatedUser("sessions-list");
    await createSession(token);

    const response = await request(app)
      .get("/proto/api/sessions")
      .set(authHeader(token));

    assert.equal(response.status, 200);
    assert.ok(Array.isArray(response.body.data));
    assert.ok(response.body.data.length > 0);
  });

  it("returns messages for an owned session", async () => {
    const { token } = await createAuthenticatedUser("sessions-msgs");
    const sessionId = await createSession(token);

    const response = await request(app)
      .get(`/proto/api/sessions/${sessionId}/messages`)
      .set(authHeader(token));

    assert.equal(response.status, 200);
    assert.ok(Array.isArray(response.body.data));
    assert.ok(response.body.data.length > 0);
  });

  it("blocks access to another user's session (IDOR)", async () => {
    const userA = await createAuthenticatedUser("session-owner");
    const userB = await createAuthenticatedUser("session-intruder");
    const sessionId = await createSession(userA.token);

    const response = await request(app)
      .get(`/proto/api/sessions/${sessionId}/messages`)
      .set(authHeader(userB.token));

    assert.equal(response.status, 404);
  });

  it("blocks sending messages to another user's session", async () => {
    const userA = await createAuthenticatedUser("chat-owner");
    const userB = await createAuthenticatedUser("chat-intruder");
    const sessionId = await createSession(userA.token);

    const response = await request(app)
      .post(`/proto/api/chat/${sessionId}/message`)
      .set(authHeader(userB.token))
      .send([{ content: "unauthorized message" }]);

    assert.equal(response.status, 404);
  });
});
