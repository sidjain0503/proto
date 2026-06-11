const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { request, app } = require("../helpers");

describe("contract: health", () => {
  it("GET /proto/api/health returns healthy when DB is reachable", async () => {
    const response = await request(app).get("/proto/api/health");

    assert.equal(response.status, 200);
    assert.equal(response.body.status, "healthy");
    assert.ok(response.body.timestamp);
  });
});
