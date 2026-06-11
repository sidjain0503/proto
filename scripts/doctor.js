#!/usr/bin/env node
/**
 * Proto health checks for local development and fork onboarding.
 */

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const root = path.join(__dirname, "..");
const backendEnv = path.join(root, "proto-backend", ".env");
const backendEnvExample = path.join(root, "proto-backend", ".env.example");
const clientEnvLocal = path.join(root, "proto-client", ".env.local");
const clientEnvExample = path.join(root, "proto-client", ".env.local.example");

const checks = [];
let failed = 0;

const pass = (name, detail) => checks.push({ name, ok: true, detail });
const fail = (name, detail) => {
  checks.push({ name, ok: false, detail });
  failed += 1;
};

const fileExists = (filePath) => fs.existsSync(filePath);

const run = (command, args, options = {}) =>
  spawnSync(command, args, { encoding: "utf8", ...options });

// 1. Env files
if (fileExists(backendEnv)) {
  pass("Backend env", "proto-backend/.env found");
} else if (fileExists(backendEnvExample)) {
  fail(
    "Backend env",
    "proto-backend/.env missing — run: cp proto-backend/.env.example proto-backend/.env"
  );
} else {
  fail("Backend env", "proto-backend/.env.example missing");
}

if (fileExists(clientEnvLocal)) {
  pass("Frontend env", "proto-client/.env.local found");
} else {
  pass(
    "Frontend env",
    "proto-client/.env.local optional (defaults to localhost API)"
  );
}

// 2. Docker MySQL (optional but recommended)
const dockerPs = run("docker", ["ps", "--format", "{{.Names}}"]);
if (dockerPs.status === 0) {
  if (dockerPs.stdout.includes("proto-mysql")) {
    pass("MySQL container", "proto-mysql is running");
  } else {
    fail("MySQL container", "proto-mysql not running — run: npm run docker:up");
  }
} else {
  fail("Docker", "Docker not available or not running");
}

// 3. Backend config validation
const configCheck = run("node", ["-e", "require('./config')"], {
  cwd: path.join(root, "proto-backend"),
});
if (configCheck.status === 0) {
  pass("Backend config", "Environment validation passed");
} else {
  fail("Backend config", (configCheck.stderr || configCheck.stdout).trim());
}

// 4. Database connectivity + migrations
const dbCheck = run("node", ["-e", "require('./db').init().then(() => process.exit(0)).catch(e => { console.error(e.message); process.exit(1); })"], {
  cwd: path.join(root, "proto-backend"),
});
if (dbCheck.status === 0) {
  pass("Database", "Connection successful");
} else {
  fail("Database", (dbCheck.stderr || dbCheck.stdout).trim() || "Connection failed");
}

// 5. Security regression
const securityCheck = run("npm", ["run", "security:check"], {
  cwd: path.join(root, "proto-backend"),
});
if (securityCheck.status === 0) {
  pass("Security check", "npm run security:check passed");
} else {
  fail("Security check", "security:check failed");
}

// 6. Contract tests
const testCheck = run("npm", ["run", "test"], {
  cwd: path.join(root, "proto-backend"),
});
if (testCheck.status === 0) {
  pass("Contract tests", "npm run test passed");
} else {
  fail("Contract tests", (testCheck.stderr || testCheck.stdout).trim() || "tests failed");
}

console.log("\nProto Doctor\n");
checks.forEach(({ name, ok, detail }) => {
  console.log(`${ok ? "✓" : "✗"} ${name}: ${detail}`);
});

console.log(`\n${checks.length - failed}/${checks.length} checks passed.`);

if (failed > 0) {
  process.exit(1);
}
