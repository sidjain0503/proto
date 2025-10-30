const mysql = require("mysql2/promise");
const { database } = require("../config");

class DatabaseConnection {
  constructor() {
    try {
      this.pool = mysql.createPool({
        host: database.host,
        user: database.user,
        password: database.password,
        database: database.name,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });
      console.log("Connection Initialised with DB");
      
    } catch (error) {
      console.error("Database connection failed:", error);
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
