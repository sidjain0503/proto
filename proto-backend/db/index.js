const mysql = require('mysql2/promise');
const { database } = require('../config');

const dbConfig = {
  host: database.host,
  user: database.user,
  password: database.password,
  database: database.name
};

let connection;

async function connectDB() {
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to MySQL database.');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

function getDB() {
  return connection;
}

module.exports = { connectDB, getDB };