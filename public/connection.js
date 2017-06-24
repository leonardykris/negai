$(function() {
  var socket = io();

  // Emit
  $('.songs').click(function(event){
    // $('#kanji-input').val(songs.bnha-ed-1.lyrics);
    socket.emit('song-selection', $(this).attr("id"));
    return false;
  });

  $('#convert-btn').click(function(event) {
    // Convert-btn should only be visible in edit mode
    // Clicking means leaving edit mode, going to view mode

    // Empty previous result
    $('#messages').html("");

    // Send event
    socket.emit('kanji-input', $('#kanji-input').val());

    return false;
  });

  $('#form-translate').submit(function(event) {
    // console.log(event);
    socket.emit('translate-input', $('#t').val());
    $('#t').val('');
    return false;
  });


  // Receive
  socket.on('kanji-output', function(message) {
    message.forEach(function(element, index) {
      $('#messages').append('<li>' + element + '</li>');
    });

    $('#convert-form').addClass("hide");
    $('#result').removeClass("hide");

    // Manage buttons visibility
    $('#convert-btn').addClass("hide");
    $('#edit-btn').removeClass("hide");
  });

  socket.on('translate-output', function(message) {
    // $('#translated').text(message);
    $('#translated').append('<li>' + message + '</li>');
  });

  socket.on('lyric-output', function(lyric) {
    $('#kanji-input').val(lyric);
    $('#kanji-input').height($('#kanji-input')[0].scrollHeight);
  });
})