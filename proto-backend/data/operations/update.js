const db = require("../../db");
const { validateData } = require("../validators");

async function updateModel(tableName, data,id, schemaName = null, ) {
  if (schemaName) {
    await validateData(data, schemaName);
  }

  try {
    const keys = Object.keys(data);
    const values = Object.values(data);
    if (!id) {
      throw new Error("ID is required for update");
    }

    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const sql = `UPDATE ${tableName} SET ${setClause} WHERE id = ?`;

    // Add the ID to the end of the values array for the WHERE clause.
    const result = await db.query(sql, [...values, id]);

    return { id, ...data };
  } catch (error) {
    throw new Error(`insertModel Failed: ${error}`);
  }
}

module.exports = {
    updateModel,
};
