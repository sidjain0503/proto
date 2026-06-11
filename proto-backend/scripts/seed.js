#!/usr/bin/env node
/**
 * Seeds development data. Safe to re-run — uses upsert semantics for demo user.
 */

const bcrypt = require("bcryptjs");
const mysql = require("mysql2/promise");
const { database } = require("../config");

const DEV_USER = {
  name: "Proto Dev",
  email: "dev@proto.local",
  password: "password123",
};

const seed = async () => {
  const connection = await mysql.createConnection({
    host: database.host,
    user: database.user,
    password: database.password,
    database: database.name,
    port: database.port || 3306,
  });

  try {
    const hashedPassword = await bcrypt.hash(DEV_USER.password, 10);

    await connection.query(
      `
      INSERT INTO users (name, email, password)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        password = VALUES(password)
    `,
      [DEV_USER.name, DEV_USER.email, hashedPassword]
    );

    console.log("Seed complete.");
    console.log(`  Demo user: ${DEV_USER.email}`);
    console.log(`  Password:  ${DEV_USER.password}`);
  } finally {
    await connection.end();
  }
};

seed().catch((error) => {
  console.error("Seed failed:", error.message);
  process.exit(1);
});
