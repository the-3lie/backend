const express = require('express');
const router = express.Router();
const Controller = require('../controller/controller');

// URL finale : POST http://[IP_DU_SERVEUR]:3000/api/bins/update
router.post('/update', Controller.collectData);

module.exports = router;