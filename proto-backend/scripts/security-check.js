#!/usr/bin/env node
/**
 * Lightweight security regression checks for Proto backend.
 * Run: npm run security:check
 */

const fs = require("fs");
const path = require("path");

const backendRoot = path.join(__dirname, "..");
const failures = [];

const read = (relativePath) =>
  fs.readFileSync(path.join(backendRoot, relativePath), "utf8");

const assertNotExists = (relativePath, reason) => {
  if (fs.existsSync(path.join(backendRoot, relativePath))) {
    failures.push(`${relativePath} should not exist: ${reason}`);
  }
};

const assertIncludes = (relativePath, needle, reason) => {
  const content = read(relativePath);
  if (!content.includes(needle)) {
    failures.push(`${relativePath}: ${reason}`);
  }
};

const assertExcludes = (relativePath, needle, reason) => {
  const content = read(relativePath);
  if (content.includes(needle)) {
    failures.push(`${relativePath}: ${reason}`);
  }
};

assertNotExists("routes/ModelRoutes.js", "generic CRUD routes removed");
assertNotExists("services/ModelService.js", "generic model service removed");
assertNotExists("requests/index.js", "dead request helper removed");

assertIncludes("app.js", "helmet", "helmet must be enabled");
assertIncludes("data/tables.js", "assertTableAllowed", "table whitelist required");
assertIncludes("services/ChatService.js", "assertSessionOwnership", "session ownership required");
assertIncludes("routes/SessionRoutes.js", "/sessions", "domain session routes required");
assertExcludes("routes/index.js", "ModelRoutes", "ModelRoutes must not be registered");

assertExcludes("routes/Auth.js", 'router.get("/users"', "unauthenticated user listing removed");

if (failures.length) {
  console.error("Security check failed:\n");
  failures.forEach((failure) => console.error(`  ✗ ${failure}`));
  process.exit(1);
}

console.log("Security check passed.");
