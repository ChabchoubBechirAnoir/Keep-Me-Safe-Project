var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fs = require('fs');
const https = require('https');
const sts = require('strict-transport-security');

//keepmesafe domain
const privateKey = fs.readFileSync('/etc/letsencrypt/live/keepmesafe.xyz/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/keepmesafe.xyz/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/keepmesafe.xyz/chain.pem', 'utf8');
const credentials = {
key: privateKey,
cert: certificate,
ca: ca
 };
var usersRouter = require('./routes/users');

var app = express();
const globalSTS = sts.getSTS({
  'max-age':{'days': 365},
  'includeSubDomains': 'false',
  'preload': true
});
app.use(globalSTS);
const mongoose = require('mongoose');

const connection = mongoose.connect('mongodb://localhost:27017');

// view engine setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});
const httpsServer = https.createServer(credentials, app);
module.exports = app;
