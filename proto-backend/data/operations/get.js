const db = require("../../db");
const { buildWhereClause } = require("../../helpers/data");
const {
  assertTableAllowed,
  assertSelectClause,
  assertOrderByClause,
  stripSensitiveColumns,
} = require("../tables");

async function getModel(tableName, conditions = {}, options = {}) {
  assertTableAllowed(tableName);

  const { where, params } = await buildWhereClause(conditions.filters);

  const select = conditions.select || "*";
  assertSelectClause(select);

  const orderBy = options.orderBy || "id";
  assertOrderByClause(orderBy);

  const limit = options.limit || 100;
  const offset = options.offset || 0;

  let sql = `SELECT ${select} FROM ${tableName} ${where}`;
  sql += ` ORDER BY ${orderBy}`;

  const limitValue = Math.min(parseInt(limit, 10) || 100, 500);
  const offsetValue = Math.max(parseInt(offset, 10) || 0, 0);
  sql += ` LIMIT ${limitValue} OFFSET ${offsetValue}`;

  const queryParams = params?.length ? [...params] : [];
  const rows = await db.query(sql, queryParams);

  if (select === "*") {
    return stripSensitiveColumns(tableName, rows);
  }

  return rows;
}

module.exports = {
  getModel,
};
