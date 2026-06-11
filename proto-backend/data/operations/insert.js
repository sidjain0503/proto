const db = require("../../db");
const { validateData } = require("../validators");
const { v4: uuidv4 } = require("uuid");
const { assertTableAllowed } = require("../tables");

async function insertModel(
  tableName,
  data,
  schemaName = null,
  binaryUUIDFields = []
) {
  assertTableAllowed(tableName);

  if (schemaName) {
    await validateData(data, schemaName);
  }

  try {
    for (const field of binaryUUIDFields) {
      if (!data[field]) {
        data[field] = uuidv4();
      }
    }
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => "?").join(", ");

    const sql = `INSERT INTO ${tableName} (${keys.join(
      ", "
    )}) VALUES (${placeholders})`;
    const result = await db.query(sql, values);

    return result.insertId ? { id: result.insertId, ...data } : { ...data };
  } catch (error) {
    throw new Error(`InsertModel Failed ${error.message}`);
  }
}

module.exports = {
  insertModel,
};
