const express = require('express');
const router = express.Router();


require('./AIRoutes')(router);
require('./auth')(router);

module.exports = router;