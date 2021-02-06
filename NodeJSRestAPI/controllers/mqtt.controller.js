const mqttData = require('../models/mqtt');
const mqtt = require('mqtt');

function MqttData(){}; 
MqttData.prototype.getResults = async (req, res , next)=> {
    mqttData.find({}, function(err, data) {
      res.json(data);      });
};
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
    const saved = await mqttData.createIdentity(mongomqttdata)
   
    console.log("a new message is received from your sensors")
  });

module.exports = MqttData;