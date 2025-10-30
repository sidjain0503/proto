const db = require("../../db");
const { buildWhereClause } = require("../../helpers/data");

async function getAll(tableName, conditions = {}, options = {}) {
  const { where, params } = buildWhereClause(conditions);

  // TODO: Refactor this logic and cover all edgecases

  let sql = `SELECT * FROM ${tableName}`;
  const orderBy = options.orderBy || 'id';
  const limit = options.limit || 100;
  const offset = options.offset || 0;

  // sql += ` ORDER BY ${orderBy}`;
  // sql += ` LIMIT ? OFFSET ?`;
  const queryParams = [];
  if (params && params.length) queryParams.push(...params);
  if (typeof limit !== 'undefined') queryParams.push(limit);
  if (typeof offset !== 'undefined') queryParams.push(offset);
  return await db.query(sql, queryParams);
}

module.exports = {
  getAll,
};
