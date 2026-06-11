const ALLOWED_TABLES = new Set([
  "users",
  "session",
  "message",
  "document",
  "document_chunk",
  "ai_usage",
]);

const SENSITIVE_COLUMNS = {
  users: new Set(["password"]),
};

const assertTableAllowed = (tableName) => {
  if (!ALLOWED_TABLES.has(tableName)) {
    throw Object.assign(new Error(`Table not allowed: ${tableName}`), {
      statusCode: 400,
    });
  }
};

const assertSelectClause = (select) => {
  if (select === "*") return;

  const columns = select.split(",").map((col) => col.trim());
  const valid = columns.every((col) => /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(col));

  if (!valid) {
    throw Object.assign(new Error(`Invalid select clause: ${select}`), {
      statusCode: 400,
    });
  }
};

const assertOrderByClause = (orderBy) => {
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*(\s+(ASC|DESC))?$/i.test(orderBy.trim())) {
    throw Object.assign(new Error(`Invalid orderBy clause: ${orderBy}`), {
      statusCode: 400,
    });
  }
};

const stripSensitiveColumns = (tableName, rows) => {
  const sensitive = SENSITIVE_COLUMNS[tableName];
  if (!sensitive) return rows;

  return rows.map((row) => {
    const safe = { ...row };
    sensitive.forEach((col) => delete safe[col]);
    return safe;
  });
};

module.exports = {
  ALLOWED_TABLES,
  assertTableAllowed,
  assertSelectClause,
  assertOrderByClause,
  stripSensitiveColumns,
};
