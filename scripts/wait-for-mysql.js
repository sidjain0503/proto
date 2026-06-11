#!/usr/bin/env node
/**
 * Waits for proto-mysql to accept connections before running migrations.
 */

const { spawnSync } = require("child_process");

const maxAttempts = 30;
const delayMs = 2000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isMysqlReady = () => {
  const result = spawnSync(
    "docker",
    [
      "exec",
      "proto-mysql",
      "mysqladmin",
      "ping",
      "-h",
      "localhost",
      "-uroot",
      "-proot",
    ],
    { encoding: "utf8" }
  );
  return result.status === 0;
};

const waitForMysql = async () => {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    if (isMysqlReady()) {
      console.log("MySQL is ready.");
      return;
    }
    console.log(`Waiting for MySQL... (${attempt}/${maxAttempts})`);
    await sleep(delayMs);
  }

  console.error("MySQL did not become ready in time.");
  process.exit(1);
};

waitForMysql();
