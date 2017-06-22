var kuroshiro = require("kuroshiro");
var app = require("express")();
var http = require("http");
var server = http.createServer(app);
var request = require("request");
var io = require('socket.io')(server);
var encodeUrl = require('encodeurl');
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
// console.log(encodeUrl("願い"));

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
    var limit = 16;
    var placeholder = "";

    // Lengthy input
    if (message.length > limit) {
      // var test = "向かい風ばかり なんで自分だけ 綺麗ごとが 嫌いだった";
      // chunks = message.split(" ");
      paragraphs = message.split("  ");

      paragraphs.forEach(function(element, index) {
        chunks = element.split(" ");

        chunks.forEach(function(slice, index) {
          slice = placeholder + "  " + slice;
          if (slice.length < limit) {
            placeholder = slice;
          } else {
            io.emit('kanji-output', kuroshiro.convert(slice, {mode: "furigana"}));
            placeholder = "";
          }
        });

        if (placeholder !== "") {
          io.emit('kanji-output', kuroshiro.convert(placeholder, {mode: "furigana"}));
          placeholder = "";
        }

        io.emit('kanji-output', "&nbsp;");
      });


    }
    // var transformed = kuroshiro.convert(message, {mode: "furigana"});
    // io.emit('kanji-output', transformed);
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
        var formatted = japanese + " (" + reading + ") " + ": " + senses;

        console.log(formatted);
      });
    }

    var getFirstResult = function(result) {
      var japanese = result[0].japanese[0].word;
      var reading = result[0].japanese[0].reading;
      var senses = result[0].senses[0].english_definitions[0];
      var formatted = japanese + " (" + reading + ") " + ": " + senses;

      io.emit('translate-output', formatted);
    }

    var word = message;
    console.log('input      : ' + word + " (" + kuroshiro.convert(word) + ")");

    var options = {
      uri: "http://jisho.org/api/v1/search/words?keyword=" + encodeUrl(word),
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
      getFirstResult(result);
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