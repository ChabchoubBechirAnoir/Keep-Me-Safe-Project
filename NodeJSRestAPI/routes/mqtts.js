var express = require('express');
var router = express.Router();
var MqttData = require('../controllers/mqtt.controller')
/* GET users listing. */

var mqttData = new MqttData();

router.get('/',[MqttData.getResults]);

module.exports = router;

router.post