var express = require('express');

var router = express.Router();
var MqttData = require('../controllers/mqtt.controller')
/* GET mqtt listing. */

var mqttData = new MqttData();

  
router.get('/',[mqttData.getResults]);

module.exports = router;
