#!/usr/bin/env node
/** server.js */
// Dependencies
const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const path = require('path');
const mqtt = require('mqtt');
const moment = require('moment');
const mongoose = require("mongoose");
//Certificate
const privateKey = fs.readFileSync('/etc/letsencrypt/live/mqtt.keepmesafe.xyz/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/mqtt.keepmesafe.xyz/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/mqtt.keepmesafe.xyz/chain.pem', 'utf8');
const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca
};
//Connection to MongoDB
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/mqtt", { useNewUrlParser: true, useUnifiedTopology: true } );
//MongoDB MQTT Schema
var mqttSchema = new mongoose.Schema({
  datetime: {
    type: String,
    default: () => moment().format("YYYY-MM-DD HH:mm:ss")
  },
  topic: String,
  payload: String
});
var MqttData = mongoose.model("mqttData", mqttSchema);
//Connection to MQTT
const client = mqtt.connect('mqtts://mqtt.keepmesafe.xyz', {
  port: 8883,
  username: 'mqttubuntu',
  password: '123456789'
});
//Creating Express App
const app = express();
//Starting both http & https servers
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);
//Connection to Socket.io
const io = require('socket.io')(httpsServer);
//Handling new user
io.on('connection', function(socket){
  console.log('A new user has been connected');
});
//Subscribing to # topic on connection
client.on('connect', function () {
  client.subscribe('#', function (err) {});
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
});
//Use EJS view engine
app.set('view engine', 'ejs');
//Expose socket.io-client and jquery to clients in browser
app.use('/lib', express.static(path.join(__dirname, 'node_modules/socket.io-client/dist/')));
app.use('/lib', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
//If request is via https execute next, else redirect to https
app.use((req, res, next) => {
  if (req.secure) {
    next();
  } else {
    res.redirect('https://' + req.headers.host + req.url);
  }
});
//Render History page
app.use('/history', (req, res) => {
  MqttData.find({}, function(err, data) {
    res.render('history', {
      history: data
    });
  });
});
//Render Main page
app.use('/', (req, res) => {
  res.render('main');
});
//Open https listener
httpsServer.listen(443, () => {
  console.log('HTTPS Server running on port 443');
});
//Open http listener
httpServer.listen(80, () => {
  console.log('HTTP Server running on port 80');
});
