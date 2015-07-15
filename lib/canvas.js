import React from 'react';

class Frame extends React.Component {
  constructor(props) {
    super(props);
    this.tools = [];
  }

  componentDidMount () {
    this.canvas = React.findDOMNode(this.refs.canvas);
    this.tools.push(new Pencil(this.canvas));
  }

  render () {
    return (
      <canvas ref="canvas" />
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
  }

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

const Canvas = {
  Frame: Frame,
  Tool: Tool,
  Pencil: Pencil
}

export default Canvas;
