var remote = require('remote');
var BrowserWindow = remote.require('browser-window');
var exec = require('child_process').exec;
var $ = require('jquery');
var Stopwatch = require('timer-stopwatch');
var xselCommand = 'xrectsel "{\\\"x\\\":%x,\\\"y\\\":%y,\\\"w\\\":%w,\\\"h\\\":%h}"';
var recorderCommand = 'byzanz-record --verbose';
var GIF = require('readwrite-gif');
var GIFEncoder = GIF.Encoder;

var frame = new BrowserWindow({
  x: 0, y: 0,
  width: screen.availWidth,
  height: screen.availHeight,
  transparent: true,
  frame: false,
  resizable: true,
  show: false
});
frame.loadUrl('file://' + __dirname + '/frame.html');

var screenCapture = function () {
  navigator.webkitGetUserMedia({
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: 'screen',
        maxWidth: screen.availWidth,
        maxHeight: screen.availHeight,
        maxFrameRate: 25
      },
      optional: []
    }
  }, function ok (stream) {
    var mediaRecorder = new MediaStreamRecorder(stream);
    mediaRecorder.mimeType = 'image/gif';
    mediaRecorder.ondataavailable = function (blob) {
        // POST/PUT "Blob" using FormData/XHR2
        var blobURL = URL.createObjectURL(blob);
        document.write('<a href="' + blobURL + '">' + blobURL + '</a>');
    };
    mediaRecorder.start(3000);
  }, function error (err) {
    console.log(err)
  });
}

$(document).ready(function() {
  var secondsPlaceholder = $('div#seconds');
  var blinkerPlaceholder = $('div#blinker');
  var recordingPlaceholder = $('div#recording');

  debugger;

  recordingPlaceholder.hide();
  var getRecorderCommand = function() {
    var duration = $params.find('input[name=duration]').val(),
      cursor = $params.find('input[name=cursor]').val(),
      x = $params.find('input[name=x]').val(),
      y = $params.find('input[name=y]').val(),
      w = $params.find('input[name=w]').val(),
      h = $params.find('input[name=h]').val(),
      output = $params.find('input[name=output]').val();

    var cmd = recorderCommand;
    cmd += ' -d ' + duration;
    cmd += ' --delay=0';
    if (cursor) {
      cmd += ' -c ';
    }
    cmd += ' -x ' + x;
    cmd += ' -y ' + y;
    cmd += ' -w ' + w;
    cmd += ' -h ' + h;
    cmd += ' ' + output;

    return cmd;
  }

  var $params = $('ol#recorder_parameters');
  $params.find('input').on('change', function () {
    $('input#recording_command').val(getRecorderCommand());
  });

  $('button#capture_region').on('click', function() {
    frame.show();
    /*
    exec(xselCommand, function(error, stdout, stderr) {
      var values = $.parseJSON(stdout);
      $params.find('input[name=x]').val(values['x']);
      $params.find('input[name=y]').val(values['y']);
      $params.find('input[name=w]').val(values['w']);
      $params.find('input[name=h]').val(values['h']);

      $('input#recording_command').val(getRecorderCommand());
    });
    */
  });

  $('button#start_recording').on('click', function() {
    var secs = $params.find('input[name=delay]').val();
    var timer = new Stopwatch(secs * 1000, {
      refreshRateMS: 1000
    });
    timer.on('done', function () {
      console.log('done');
      blinkerPlaceholder.hide();
      recordingPlaceholder.show();

      exec(getRecorderCommand(), function(error, stdout, stderr) {
          console.log(stdout);
          recordingPlaceholder.text('done recording');
      });

    });
    timer.on('time', function(time) {
      console.log(time.ms); // number of milliseconds past (or remaining);
      secondsPlaceholder.text(secs--);
    });
    timer.start();
  });
});
