const mysql = require("mysql2/promise");
const { database } = require("../config");

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
    });
  }

  async init() {
    try {
      await this.pool.query("SELECT 1");
      console.log("DB Initialisation Successful");
    } catch (error) {
      console.error("Initial Starttup Error: DB unreachable:", error.message);
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
  }
}

module.exports = new DatabaseConnection();
