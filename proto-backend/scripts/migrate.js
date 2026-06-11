#!/usr/bin/env node
/**
 * Runs SQL migrations from db/migrations in filename order.
 * Tracks applied migrations in proto_migrations.
 */

const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");
const { database } = require("../config");

const MIGRATIONS_DIR = path.join(__dirname, "../db/migrations");

const ensureMigrationsTable = async (connection) => {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS proto_migrations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
};

const getAppliedMigrations = async (connection) => {
  const [rows] = await connection.query(
    "SELECT name FROM proto_migrations ORDER BY name ASC"
  );
  return new Set(rows.map((row) => row.name));
};

const getMigrationFiles = () =>
  fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((file) => file.endsWith(".sql"))
    .sort();

const runMigration = async (connection, fileName) => {
  const filePath = path.join(MIGRATIONS_DIR, fileName);
  const sql = fs.readFileSync(filePath, "utf8");
  const statements = sql
    .split(";")
    .map((statement) => statement.trim())
    .filter(Boolean);

  await connection.beginTransaction();
  try {
    for (const statement of statements) {
      await connection.query(statement);
    }
    await connection.query("INSERT INTO proto_migrations (name) VALUES (?)", [
      fileName,
    ]);
    await connection.commit();
    console.log(`  ✓ ${fileName}`);
  } catch (error) {
    await connection.rollback();
    throw error;
  }
};

const migrate = async () => {
  const connection = await mysql.createConnection({
    host: database.host,
    user: database.user,
    password: database.password,
    database: database.name,
    port: database.port || 3306,
    multipleStatements: true,
  });

  try {
    await ensureMigrationsTable(connection);
    const applied = await getAppliedMigrations(connection);
    const files = getMigrationFiles();
    const pending = files.filter((file) => !applied.has(file));

    if (!pending.length) {
      console.log("No pending migrations.");
      return;
    }

    console.log(`Applying ${pending.length} migration(s)...`);
    for (const file of pending) {
      await runMigration(connection, file);
    }
    console.log("Migrations complete.");
  } finally {
    await connection.end();
  }
};

migrate().catch((error) => {
  console.error("Migration failed:", error.message);
  process.exit(1);
});
