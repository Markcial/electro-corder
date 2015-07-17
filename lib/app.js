import React from 'react';
import {Slider, Button, Timer} from "./ui/core"
import {TabbedArea, TabPane} from 'react-bootstrap';
import Canvas from "./canvas"
import remote from 'remote';
import GIF from 'readwrite-gif';
var GIFEncoder = GIF.Encoder;
var fs = remote.require('fs');

class App extends React.Component {

  constructor(props) {
    super(props);
    this.settings = {}
  }

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

  onSlideMoved (evt) {
    console.log(evt.target.value);
  }

  /*
  <Canvas.Frame>
    <Canvas.WebcamSource />
  </Canvas.Frame>
  */

  render () {
    return (
      <TabbedArea defaultActiveKey={1}>
        <TabPane eventKey={1} tab='Tab 1'>
          <Canvas.Frame sources={[Canvas.DesktopSource]} />
          <Slider orientation="horizontal" onSlide={(e) => this.onSlideMoved(e)} />
          <Timer ref="timer" />
          <Button click={(e) => {this.recordDesktop()}} label="Record desktop" />
          <Button click={(e) => {this.startRecording()}} label="Start recording" />
          <Button click={(e) => {this.refs.timer.resetTimer()}} label="Reset Timer" />
          <Button click={(e) => {this.refs.timer.stopTimer()}} label="Stop Timer" />
          <Button click={(e) => {this.refs.timer.setState({seconds:20})}} label="Reset timer (20)" />
        </TabPane>
        <TabPane eventKey={2} tab='Tab 2'>TabPane 2 content</TabPane>
        <TabPane eventKey={3} tab='Tab 3' disabled={true}>TabPane 3 content</TabPane>
      </TabbedArea>
    );
  }
}

window.onload = function () {
  React.render(<App />, document.body);
}
