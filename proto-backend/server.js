require("./instrumentation");
const app = require("./app");
const { port } = require("./config");
const db = require("./db");
const logger = require("./lib/logger");
const { setupSwaggerUI } = require("./swagger.config");

(async () => {
  setupSwaggerUI(app);
  await db.init();
  app.listen(port, () => {
    logger.info({ port }, "Server started");
  });
})();
