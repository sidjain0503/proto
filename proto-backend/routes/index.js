const express = require('express');
const router = express.Router();


require('./AIRoutes')(router);
require('./Auth')(router);
require('./ModelRoutes')(router);

module.exports = router;