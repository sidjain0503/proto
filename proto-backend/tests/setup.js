/**
 * Test environment bootstrap — loaded via node --require before tests run.
 */
const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "../.env") });

delete process.env.LANGFUSE_SECRET_KEY;
delete process.env.LANGFUSE_PUBLIC_KEY;

process.env.ENVIRONMENT = process.env.ENVIRONMENT || "local";
process.env.LOG_LEVEL = process.env.LOG_LEVEL || "silent";
process.env.SECURITY_TOKEN_SECRET =
  process.env.SECURITY_TOKEN_SECRET || "test-secret-key-min-16-chars";
process.env.SECURITY_TOKEN_LIFE = process.env.SECURITY_TOKEN_LIFE || "8h";
process.env.PORT = process.env.PORT || "8080";
process.env.CORS_ORIGINS =
  process.env.CORS_ORIGINS || "http://localhost:3000";

const { parseEnv } = require("../config/env.schema");
parseEnv();

const { after } = require("node:test");

after(async () => {
  try {
    const db = require("../db");
    await db.close();
  } catch {
    // ignore teardown errors
  }
});
