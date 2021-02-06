var mongoose = require('mongoose')

var mqttSchema = new mongoose.Schema({
    datetime: {
      type: String,
      default: () => moment().format("YYYY-MM-DD HH:mm:ss")
    },
    topic: String,
    payload: String
  });


  mqttSchema.statics.createmqtt = (infos)=> {
    const mqtt = new mongoose.model("Mqtt", mqttSchema)(infos);
    return mqtt.save();
};

module.exports = mongoose.model('Mqtt',mqttSchema);