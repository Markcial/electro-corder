import React from 'react';
import {Point, Rectangle} from './spatial';

class Source extends React.Component {
  constructor(props, constraints = {audio:false, video:true}) {
    super(props);
    this.settings = {
      constraints : constraints
    };
  }

  onStartRecording (stream) {
    this.video = React.findDOMNode(this);
    this.video.width = screen.availWidth;
    this.video.height = screen.availHeight;
    this.video.muted = true;
    this.video.autoplay = true;
    this.video.src = URL.createObjectURL(stream);
  }

  onStreamError (error) {
    console.log(error);
  }

  record () {
    navigator.webkitGetUserMedia(
      this.settings.constraints,
      (stream) => this.onStartRecording(stream),
      (error) => this.onStreamError(error)
    );
  }

  componentDidMount () {
    this.record();
  }

  render () {
    return <video />;
  }
}

class DesktopSource extends Source {
  constructor(props) {
    super(
      props,
      {
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
      }
    );
  }
}

class WebcamSource extends Source {
  constructor(props) {
    super(props, {audio: false, video: true});
  }
}

class Frame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      source: this.props.source
    }
    this.tools = [];
  }

  componentDidMount () {
    this.canvas = React.findDOMNode(this);
    this.tools.push(new Selection(this.canvas));
    //this.tools.push(new Pencil(this.canvas));

    this.context = this.canvas.getContext("2d");

    Array.map(this.canvas.childNodes, (source) => {
      this.addSource(source);
    });
  }

  addSource (source) {
    let preview = () => {
      this.context.drawImage(source, 0, 0);
      requestAnimationFrame(() => {preview()});
    };
    preview();
  }

  render () {
    return (
      <canvas>
      {React.Children.map(this.props.children, (element, idx) => {
        return React.cloneElement(element, { ref: idx });
      })}
      </canvas>
    );
  }
}

class Tool {
  constructor(canvas) {
    this.canvas = canvas;
    let context = canvas.getContext('2d');
    this.context = context;

    this.canvas.onclick = (e) => {this.onClick(e)}
    this.canvas.onmousedown = (e) => {this.onMouseDown(e)}
    this.canvas.onmousemove = (e) => {this.onMouseMove(e)}
    this.canvas.onmouseup = (e) => {this.onMouseUp(e)}
    this.canvas.onmouseover = (e) => {this.onMouseOver(e)}
    this.canvas.onmouseout = (e) => {this.onMouseOut(e)}
    this.canvas.oncontextmenu = (e) => {this.onContextMenu(e)}
    this.canvas.ondblclick = (e) => {this.onDblClick(e)}
    this.canvas.onwheel = (e) => {this.onWheel(e)}

    this._canvasFrameTick();
  }

  _canvasFrameTick () {
    requestAnimationFrame(() => {
      this._canvasFrameTick ();
      this.onCanvasRedraw();
    })
  }

  onCanvasRedraw() {}
  onClick (e) {}
  onMouseDown (e) {}
  onMouseMove (e) {}
  onMouseUp (e) {}
  onMouseOver (e) {}
  onMouseOut (e) {}
  onContextMenu (e) {}
  onDblClick (e) {}
  onWheel (e) {}
}

class Pencil extends Tool {
  onMouseDown(e) {
    let x = e.clientX - this.canvas.offsetLeft;
    let y = e.clientY - this.canvas.offsetTop;
    this.isPressed = true;
    this.context.beginPath();
    this.context.moveTo(x, y);
    this.context.strokeStyle = 1;
    this.context.lineWidth = 1;
  }

  onMouseMove(e) {
    if (this.isPressed) {
      let x = e.clientX - this.canvas.offsetLeft;
      let y = e.clientY - this.canvas.offsetTop;

      this.context.lineTo(x, y);
      this.context.stroke();
    }
  }

  onMouseUp(e) {
    this.isPressed = false;
    this.context.closePath();
  }
}

class Selection extends Tool {
  onMouseDown(e) {
    let x = e.clientX - this.canvas.offsetLeft;
    let y = e.clientY - this.canvas.offsetTop;
    this.pointA = new Point(x, y);
    this.pointB = new Point(x, y);
    this.rectangle = new Rectangle(this.pointA, this.pointB);
  }

  onMouseMove(e) {
    if (this.pointB) {
      let x = e.clientX - this.canvas.offsetLeft;
      let y = e.clientY - this.canvas.offsetTop;
      this.pointB.x = x;
      this.pointB.y = y;
    }
  }

  onMouseUp(e) {
    this.rectangle = null;
  }

  onCanvasRedraw() {
    if (this.rectangle) {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.beginPath();
      this.context.setLineDash([5]);
      this.context.rect(this.pointA.x, this.pointA.y, this.pointB.x, this.pointB.y);
      this.context.stroke();
      this.context.closePath();
    }
  }
}

const Canvas = {
  DesktopSource: DesktopSource,
  WebcamSource: WebcamSource,
  Frame: Frame,
  Tool: Tool,
  Pencil: Pencil,
  Selection: Selection
}

export default Canvas;
