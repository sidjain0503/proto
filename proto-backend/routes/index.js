const express = require('express');
const router = express.Router();


require('./AIRoutes')(router);
require('./Auth')(router);

module.exports = router;