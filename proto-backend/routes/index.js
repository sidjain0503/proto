const express = require('express');
const router = express.Router();

require('./ChatRoutes')(router);
require('./AIRoutes')(router);
require('./Auth')(router);
require('./ModelRoutes')(router);
require('./DocumentRoutes')(router);

module.exports = router;