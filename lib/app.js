import React from 'react';
import {Button, Preview, Timer} from "./ui/core"
import Canvas from "./canvas"
import remote from 'remote';
import GIF from 'readwrite-gif';

var GIFEncoder = GIF.Encoder;
var fs = remote.require('fs');

class App extends React.Component {

  startRecording() {

    var canvas = React.findDOMNode(this.refs.canvas);
    var context = canvas.getContext('2d');

    var gifEncoder = new GIFEncoder();
    gifEncoder.setRepeat(0);
    gifEncoder.setDelay(300);
    gifEncoder.setQuality(1);
    gifEncoder.start();

    var record = () => {
      gifEncoder.addFrame(context);
      requestAnimationFrame(() => {record()});
    }
    record();

    setTimeout(() => {
      var gifBlob = new Blob([new Uint8Array(gifEncoder.stream().bin)], {
          type: 'image/gif'
      });
      // todo: find a way to clear old recorded blobs
      gifEncoder.stream().bin = [];

      var reader = new FileReader();
      reader.onload = function() {
        var dataUrl = reader.result;
        var base64 = dataUrl.split(',')[1];

        var buf = new Buffer(base64, 'base64'); // decode


        var now = new Date();
        var save_as = now.toUTCString() + '.gif';

        fs.writeFile(save_as, buf, function(err) {
          console.log(err);
        });
      };
      reader.readAsDataURL(gifBlob);

    }, 2000);
  }

  recordDesktop() {
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
    }, (stream) => this.onStartRecording(stream), (error) => this.onStreamError(error));
  }

  onStartRecording (stream) {
    this.video = React.findDOMNode(this.refs.video);
    this.video.style.display = 'none';
    this.video.width = screen.availWidth;
    this.video.height = screen.availHeight;
    this.video.muted = true;
    this.video.autoplay = true;
    this.video.src = URL.createObjectURL(stream);

    this.canvas = React.findDOMNode(this.refs.canvas);
    this.context = this.canvas.getContext("2d");

    requestAnimationFrame(() => {
      this.drawPreview()
    })
  }

  drawPreview() {
    requestAnimationFrame(() => {this.drawPreview()});
    this.context.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
  }

  onStreamError (error) {
    console.log(error);
  }

  render () {
    return (
      <div>
        <h1>Recorder</h1>
        <Canvas.Frame ref="canvas" />
        <video ref="video" />
        <Timer ref="timer" />
        <Button click={(e) => {this.recordDesktop()}} label="Record desktop" />
        <Button click={(e) => {this.startRecording()}} label="Start recording" />
        <Button click={(e) => {this.refs.timer.resetTimer()}} label="Reset Timer" />
        <Button click={(e) => {this.refs.timer.stopTimer()}} label="Stop Timer" />
        <Button click={(e) => {this.refs.timer.setState({seconds:20})}} label="Reset timer (20)" />
      </div>
    );
  }
}

window.onload = function () {
  React.render(<App />, document.body);
}
