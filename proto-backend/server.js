const app = require('./app');
const { port } = require('./config');
const db = require('./db');


(async () => {
  await db.init();
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
})();
