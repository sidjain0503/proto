const db = require("../../db");
const { validateData } = require("../validators");
const { assertTableAllowed } = require("../tables");

async function updateModel(tableName, data, id, schemaName = null) {
  assertTableAllowed(tableName);

  if (schemaName) {
    await validateData(data, schemaName);
  }

  try {
    const keys = Object.keys(data);
    const values = Object.values(data);
    if (!id) {
      throw new Error("ID is required for update");
    }

    const setClause = keys.map((key) => `${key} = ?`).join(", ");
    const sql = `UPDATE ${tableName} SET ${setClause} WHERE id = ?`;

    await db.query(sql, [...values, id]);

    return { id, ...data };
  } catch (error) {
    throw new Error(`updateModel Failed: ${error}`);
  }
}

module.exports = {
  updateModel,
};
