var express = require('express');
const mqtt = require('mqtt');

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
    //Emit event to socket
    io.emit("mqtt", { datetime: moment().format("YYYY-MM-DD HH:mm:ss"), topic: topic, message: message.toString()});
    //Saving received data to MongoDB
    var mongomqttdata = new MqttData({
      topic: topic,
      payload: message.toString()
    });
    mongomqttdata.save();
    console.log("a new message is received from your sensors")
  });
  
router.get('/',[mqttData.getResults]);

module.exports = router;
