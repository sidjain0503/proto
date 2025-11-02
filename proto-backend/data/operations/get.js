const db = require("../../db");
const { buildWhereClause } = require("../../helpers/data");

async function getAll(tableName, conditions = {}, options = {}) {
  const { where, params } = await buildWhereClause(conditions.filters);
  
  const select = conditions.select || "*";
  const orderBy = options.orderBy || 'id';
  const limit = options.limit || 100;
  const offset = options.offset || 0;
  let sql = `SELECT ${select} FROM ${tableName} ${where}`;

  // LIMIT and OFFSET cannot use placeholders in MySQL - they must be literal values
  sql += ` ORDER BY ${orderBy}`;
  const limitValue = parseInt(limit, 10) || 100;
  const offsetValue = parseInt(offset, 10) || 0;
  sql += ` LIMIT ${limitValue} OFFSET ${offsetValue}`;
  const queryParams = [];
  if (params && params.length) queryParams.push(...params);
  return await db.query(sql, queryParams);
}

module.exports = {
  getAll,
};
