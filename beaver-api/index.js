import express from "express";
import consign from "consign";
var bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb'}));

consign()
  .include("libs/config.js")
  .then("db.js")
  .then("auth.js")
  .then("libs/middlewares.js")
  .then("sockets")
  .then("routes")
  .then("libs/boot.js")
  .into(app);

  module.exports = app;
