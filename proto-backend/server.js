require("./instrumentation");
const app = require('./app');
const { port } = require('./config');
const db = require('./db');
const { setupSwaggerUI } = require('./swagger.config');


(async () => {
  setupSwaggerUI(app); 
  await db.init();
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
})();
