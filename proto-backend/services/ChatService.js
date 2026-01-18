const { insertModel } = require("../data/operations/insert");

async function createSession(req, res) {
  try {
    await insertModel("session", { id: sessionId }, "session");
  } catch (error) {
    throw error;
  }
}

module.exports = { createSession };
