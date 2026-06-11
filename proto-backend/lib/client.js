const fs = require("fs");
const path = require("path");

const CLIENT_ENTRY = path.join(__dirname, "../../client/index.js");

const loadClient = () => {
  if (!fs.existsSync(CLIENT_ENTRY)) {
    return null;
  }

  try {
    const client = require(CLIENT_ENTRY);
    return client && typeof client === "object" ? client : null;
  } catch (error) {
    const logger = require("./logger");
    logger.warn({ err: error }, "Failed to load client overlay");
    return null;
  }
};

module.exports = {
  loadClient,
};
