const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const {
  assertTableAllowed,
  assertSelectClause,
  assertOrderByClause,
} = require("../../data/tables");

describe("unit: data table guards", () => {
  it("allows whitelisted tables", () => {
    assert.doesNotThrow(() => assertTableAllowed("users"));
    assert.doesNotThrow(() => assertTableAllowed("session"));
  });

  it("rejects unknown tables", () => {
    assert.throws(() => assertTableAllowed("secrets"), /not allowed/i);
  });

  it("validates select clauses", () => {
    assert.doesNotThrow(() => assertSelectClause("id, email, name"));
    assert.throws(
      () => assertSelectClause("id; DROP TABLE users"),
      /invalid select/i
    );
  });

  it("validates orderBy clauses", () => {
    assert.doesNotThrow(() => assertOrderByClause("created_at DESC"));
    assert.throws(
      () => assertOrderByClause("1; DROP TABLE users"),
      /invalid orderBy/i
    );
  });
});
