var express = require("express");
var path = require("path");
var router = express.Router();

var app = express();

app.use(express.static(path.join(__dirname, "public")));

router.get('/', function(req, res) {
  res.sendFile("index");
});



module.exports = app;