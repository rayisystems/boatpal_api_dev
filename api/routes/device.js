const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const DevicesController = require('../controllers/device');

router.get('/getDevices', DevicesController.devices_get_all_device);
router.post('/create',  DevicesController.devices_create_device);

module.exports = router;