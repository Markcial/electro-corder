var remote = require('remote');
var BrowserWindow = remote.require('browser-window');
var dialog = remote.require('dialog');
var fs = remote.require('fs');
var Stopwatch = require('timer-stopwatch');
var GIF = require('readwrite-gif');
var GIFEncoder = GIF.Encoder;
var filename = null;

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

this.GifRecorder = function (mediaStream) {
    if (!window.GIFEncoder) {
        throw 'Please link: https://cdn.webrtc-experiment.com/gif-recorder.js';
    }

    // void start(optional long timeSlice)
    // timestamp to fire "ondataavailable"
    this.start = function(timeSlice) {
        timeSlice = timeSlice || 1000;

        var imageWidth = this.videoWidth || 320;
        var imageHeight = this.videoHeight || 240;

        canvas.width = video.width = imageWidth;
        canvas.height = video.height = imageHeight;

        // external library to record as GIF images
        gifEncoder = new GIFEncoder();

        // void setRepeat(int iter)
        // Sets the number of times the set of GIF frames should be played.
        // Default is 1; 0 means play indefinitely.
        gifEncoder.setRepeat(0);

        // void setFrameRate(Number fps)
        // Sets frame rate in frames per second.
        // Equivalent to setDelay(1000/fps).
        // Using "setDelay" instead of "setFrameRate"
        gifEncoder.setDelay(this.frameRate || 200);

        // void setQuality(int quality)
        // Sets quality of color quantization (conversion of images to the
        // maximum 256 colors allowed by the GIF specification).
        // Lower values (minimum = 1) produce better colors,
        // but slow processing significantly. 10 is the default,
        // and produces good color mapping at reasonable speeds.
        // Values greater than 20 do not yield significant improvements in speed.
        gifEncoder.setQuality(this.quality || 1);

        // Boolean start()
        // This writes the GIF Header and returns false if it fails.
        gifEncoder.start();

        startTime = Date.now();

        function drawVideoFrame(time) {
            lastAnimationFrame = requestAnimationFrame(drawVideoFrame);

            if (typeof lastFrameTime === undefined) {
                lastFrameTime = time;
            }

            // ~10 fps
            if (time - lastFrameTime < 90) return;

            context.drawImage(video, 200, 60, 100, 100);

            gifEncoder.addFrame(context);

            // console.log('Recording...' + Math.round((Date.now() - startTime) / 1000) + 's');
            // console.log("fps: ", 1000 / (time - lastFrameTime));

            lastFrameTime = time;
        }

        lastAnimationFrame = requestAnimationFrame(drawVideoFrame);

        timeout = setTimeout(doneRecording, timeSlice);
    };

    function doneRecording() {
        endTime = Date.now();

        var gifBlob = new Blob([new Uint8Array(gifEncoder.stream().bin)], {
            type: 'image/gif'
        });
        self.ondataavailable(gifBlob);

        // todo: find a way to clear old recorded blobs
        gifEncoder.stream().bin = [];
    };

    this.stop = function() {
        if (lastAnimationFrame) {
            cancelAnimationFrame(lastAnimationFrame);
            clearTimeout(timeout);
            doneRecording();
        }
    };

    this.ondataavailable = function() {};
    this.onstop = function() {};

    // Reference to itself
    var self = this;

    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');

    var video = document.createElement('video');
    video.muted = true;
    video.autoplay = true;
    video.src = URL.createObjectURL(mediaStream);
    video.play();

    var lastAnimationFrame = null;
    var startTime, endTime, lastFrameTime;

    var gifEncoder;
    var timeout;
}

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
    console.log('ok');
    var mediaRecorder = new MediaStreamRecorder(stream);
    mediaRecorder.mimeType = 'image/gif';
    //mediaRecorder.videoWidth = screen.availWidth;
    //mediaRecorder.videoHeight = screen.availHeight;
    mediaRecorder.ondataavailable = function (blob) {
      var save_as = filename;
      if (!save_as) {
        var now = new Date();
        save_as = now.toUTCString() + '.gif';
      }

      var buf = new Buffer(blob, 'base64'); // decode

      fs.writeFile(save_as, buf, function(err) {
        console.log(err);
      });
        // POST/PUT "Blob" using FormData/XHR2
        //var blobURL = URL.createObjectURL(blob);
        //document.write('<a href="' + blobURL + '">' + blobURL + '</a>');
    };
    mediaRecorder.start(3000);
  }, function error (err) {
    console.log(err)
  });
}

$(document).ready(function() {
console.log(ui);
  ui.buttons.select_region.on('click', function() {
    console.log('select region');
    frame.show();
  });

  ui.buttons.save_as.on('click', function () {
    dialog.showSaveDialog({'title': 'Save as..'}, function (file) {
      filename = file;
    });
  });

  $('button#record_start').on('click', function() {
    console.log('asdad');
    //var secs = $params.find('input[name=delay]').val();
    var timer = new Stopwatch(5000, {
      refreshRateMS: 1000
    });
    timer.on('done', function () {
      console.log('done');
      screenCapture();
    });
    timer.on('time', function(time) {
      console.log(time.ms); // number of milliseconds past (or remaining);
    });
    timer.start();
  });
});
