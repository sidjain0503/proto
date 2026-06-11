const mysql = require("mysql2/promise");
const { database } = require("../config");
const { ENVIRONMENT } = require("../config");
const { createLogger } = require("../lib/logger");

const log = createLogger("db");

let additionalDbConfig = {};

if (ENVIRONMENT !== "local") {
  additionalDbConfig = {
    ssl: {
      rejectUnauthorized: true,
    },
  };
}

class DatabaseConnection {
  constructor() {
    this.pool = mysql.createPool({
      host: database.host,
      user: database.user,
      password: database.password,
      database: database.name,
      port: database.port || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      ...additionalDbConfig,
    });
  }

  async init() {
    try {
      await this.pool.query("SELECT 1");
      log.info("Database connection established");
    } catch (error) {
      log.fatal({ err: error }, "Database unreachable at startup");
      process.exit(1);
    }
  }

  async getConnection() {
    return await this.pool.getConnection();
  }

  async query(sql, params = []) {
    const [results] = await this.pool.execute(sql, params);
    return results;
  }

  async close() {
    await this.pool.end();
    log.info("Database pool closed");
  }
}

module.exports = new DatabaseConnection();
