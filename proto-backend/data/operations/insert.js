const db = require("../../db");
const { validateData } = require("../validators");

async function insertModel(tableName, data, schemaName = null) {
  if (schemaName) {
    await validateData(data, schemaName);
  }

  try {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => "?").join(", ");

    const sql = `INSERT INTO ${tableName} (${keys.join(
      ", "
    )}) VALUES (${placeholders})`;
    const result = await db.query(sql, values);

    return { id: result.insertId, ...data };
  } catch (error) {
    throw new Error(`InsertModel Failed ${error}`);
  }
}

module.exports = {
  insertModel,
};
