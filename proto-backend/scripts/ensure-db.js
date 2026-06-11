#!/usr/bin/env node
/**
 * Creates the application database if it does not exist.
 * Useful before first migration against a fresh MySQL instance.
 */

const mysql = require("mysql2/promise");
const { database } = require("../config");

const ensureDatabase = async () => {
  const connection = await mysql.createConnection({
    host: database.host,
    user: database.user,
    password: database.password,
    port: database.port || 3306,
  });

  try {
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${database.name}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    console.log(`Database ready: ${database.name}`);
  } finally {
    await connection.end();
  }
};

ensureDatabase().catch((error) => {
  console.error("Database bootstrap failed:", error.message);
  process.exit(1);
});
