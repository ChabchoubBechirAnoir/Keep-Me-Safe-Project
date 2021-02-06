var express = require('express');

var router = express.Router();
var MqttData = require('../controllers/mqtt.controller')
/* GET mqtt listing. */

var mqttData = new MqttData();
//Connection to MQTT
const client = mqtt.connect('mqtts://mqtt.keepmesafe.xyz', {
  port: 8883,
  username: 'mqttubuntu',
  password: '123456789'
});
//On received MQTT message
client.on('message', function (topic, message) {
    //Saving received data to MongoDB
    var mongomqttdata = {
      topic: topic,
      payload: message.toString()
    };
    const saved = mqttData.addmqtt(mongomqttdata)
    console.log("a new message is received from your sensors")
  });
  
router.get('/',[mqttData.getResults]);

module.exports = router;
