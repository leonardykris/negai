var kuroshiro = require("kuroshiro");
var app = require("express")();
var http = require("http");
var server = http.createServer(app);
var request = require("request");
var io = require('socket.io')(server);
// var Dictionary = require("japaneasy");
// var dict = new Dictionary({
//   dictionary: "auto",
//   input: "japanese",
//   method: "kanji",
//   encode: "UTF-8",
//   mirror: "usa",
//   timeout: 500
// });

kuroshiro.init();

// dict("辞書").then(function(result) {
//   console.log(result);
// });

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');

  // kuroshiro.init(function (error) {
  //   var result = kuroshiro.convert('願い', {mode: "furigana"});
  //   // res.send(result);
  //   res.sendFile(__dirname + '/index.html');
  // });
});

io.on('connection', function(socket){
  console.log('somebody is connected!');

  socket.on('kanji-input', function(message){
    // console.log('input: ' + message);
    var transformed = kuroshiro.convert(message, {mode: "furigana"});
    io.emit('kanji-output', transformed);
  });

  socket.on('translate-input', function(message){

    // var transformed = kuroshiro.convert(message, {mode: "furigana"});

    // var translated = dict(message).then(function(result) {
    //   console.log(result);
    // });
    // io.emit('translate-output', translated);
    var list = function(result) {
      result.forEach(function(record, index) {
        var japanese = record.japanese[0].word;
        var reading = record.japanese[0].reading;
        var senses = record.senses[0].english_definitions[0];
        console.log(japanese + " (" + reading + ") " + ": " + senses);
      });
    }

    var word = message;
    console.log('input      : ' + word + " (" + kuroshiro.convert(word) + ")");

    var options = {
      uri: "http://jisho.org/api/v1/search/words?keyword=" + word,
      method: "GET",
      timeout: 10000,
      followRedirect: true,
      maxRedirects: 10,
      json: true
    }

    request(options, function(error, response, body) {
      console.log('error      : ', error);
      console.log('statusCode : ', response && response.statusCode);
      // console.log('body: ', body);

      var result = body.data;
      list(result);


      // console.log(result);


    });
  });

  // Disconnect
  socket.on('disconnect', function(){
    console.log('ah, they disconnected');
  })
});

server.listen(7000, function() {
  console.log('Listening on port: 7000');
});