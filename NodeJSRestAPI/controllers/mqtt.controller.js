const mqttData = require('../models/mqtt');

function MqttData(){}; 
MqttData.prototype.getResults = async (req, res , next)=> {
    mqttData.find({}, function(err, data) {
        res.render('history', {
          history: data
        });
      });
};

module.exports = MqttData;