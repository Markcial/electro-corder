import React from 'react';
import range from '../misc/utils';

export class Button extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      label: props.label,
      click: props.click
    };
  }

  click (evt) {
    this.state.click(evt);
  }

  render() {
    return (
      <button onClick={(e) => this.click(e)}>{this.state.label}</button>
    );
  }
}
Button.propTypes = { label: React.PropTypes.string, click: React.PropTypes.function };
Button.defaultProps = { label: 'Button', click: () => {} };

class Tab extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      label: props.label,
      selected: props.selected,
      click: props.click
    }
  }

  render () {
    return (
      <li><button onClick={this.state.click.bind(this)}>{this.state.label}</button></li>
    );
  }
}
Tab.propTypes = { label: React.PropTypes.string };
Tab.defaultProps = { label: 'Tab' };

class TabPane extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      label: props.label,
      content: props.content,
      visible: props.visible
    }
  }
  render () {
    if (!this.state.visible) {
      return null;
    } else {
      return (
        <div>
          <h2>{this.state.label}</h2>
          <p>{this.state.content}</p>
        </div>
      );
    }
  }
}
TabPane.propTypes = { label: React.PropTypes.string };
TabPane.defaultProps = { label: 'TabPane' };

export class Notebook extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      label: props.label,
      index: props.index,
      tabs: props.tabs
    }
    this.tabs = [];
    this.panes = [];
  }

  onTabSwitch(event) {

  }

  switch (index, event) {
    for (var pane of this.panes) {
      pane.props.visible = index != pane.key;
    }
    //  this.panes[index].toggle();
  }

  render () {
    for (var v of range(0, this.state.tabs)) {
      this.panes[v] = <TabPane key={v} content={v} visible={v==this.state.index} />;
      this.tabs[v] = <Tab key={v} click={this.switch.bind(this, v)} />;
      //let current = v == this.state.index;
    }
    return (
      <fieldset>
        <legend>{this.state.label}</legend>
        <ol>
        {this.tabs}
        </ol>
        {this.panes}
      </fieldset>
    );
  }
}
Notebook.propTypes = {
  label: React.PropTypes.string,
  tabs: React.PropTypes.number,
  index: React.PropTypes.number
};
Notebook.defaultProps = { label: 'Notebook', tabs: 2, index:1 };

export class Timer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {seconds: props.seconds};
  }

  onTimerTick (seconds) {}
  onTimerEnd () {}
  componentDidMount () {}

  stopTimer() {
    clearInterval(this.intervalID);
  }

  resetTimer() {
    this.stopTimer();
    this.setState({seconds:this.props.seconds});
    this.startTimer();
  }

  startTimer () {
    this.stopTimer();
    this.intervalID = setInterval(() => {
      if (this.state.seconds > 0) {
        this.onTimerTick(this.state.seconds);
        this.tick();
      } else {
        this.stopTimer();
        this.onTimerEnd();
      }
    }, 1000);
  }

  tick() {
    this.setState({ seconds: this.state.seconds - 1 });
  }

  render() {
    return (
      <div>
        Seconds left: {this.state.seconds}
      </div>
    );
  }
}
Timer.propTypes = { seconds: React.PropTypes.number };
Timer.defaultProps = { seconds: 10 };

export class Preview extends React.Component {

  startRecording () {
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
    this.video.muted = true;
    this.video.autoplay = true;
    this.video.src = URL.createObjectURL(stream);

    this.canvas = React.findDOMNode(this.refs.preview);
    this.context = this.canvas.getContext("2d");
    this.enrichenCanvasContext(this.context);

    requestAnimationFrame(() => {this.drawPreview()})
  }

  drawPreview() {
    requestAnimationFrame(() => {this.drawPreview()});
    this.context.drawImage(this.video, 0, 0);
  }

  onStreamError (error) {
    console.log(error);
  }

  componentDidMount () {
    this.startRecording();
  }

  onVideoClick (evt) {
    console.log(evt);
  }

  onWheel (evt) {
    var lastX=this.canvas.width/2, lastY=this.canvas.height/2;
    var pt = this.context.transformedPoint(lastX,lastY);
    console.log(evt.deltaY);
    if (evt.deltaY > 0) {
      var scale = 0.9;
    } else {
      var scale = 1.1;
    }
		this.context.translate(pt.x,pt.y);
    this.context.scale(scale, scale);
    this.context.translate(-pt.x,-pt.y);
  }

  enrichenCanvasContext(ctx) {
		var svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
		var xform = svg.createSVGMatrix();
		ctx.getTransform = function(){ return xform; };

		var savedTransforms = [];
		var save = ctx.save;
		ctx.save = function(){
			savedTransforms.push(xform.translate(0,0));
			return save.call(ctx);
		};
		var restore = ctx.restore;
		ctx.restore = function(){
			xform = savedTransforms.pop();
			return restore.call(ctx);
		};

		var scale = ctx.scale;
		ctx.scale = function(sx,sy){
			xform = xform.scaleNonUniform(sx,sy);
			return scale.call(ctx,sx,sy);
		};
		var rotate = ctx.rotate;
		ctx.rotate = function(radians){
			xform = xform.rotate(radians*180/Math.PI);
			return rotate.call(ctx,radians);
		};
		var translate = ctx.translate;
		ctx.translate = function(dx,dy){
			xform = xform.translate(dx,dy);
			return translate.call(ctx,dx,dy);
		};
		var transform = ctx.transform;
		ctx.transform = function(a,b,c,d,e,f){
			var m2 = svg.createSVGMatrix();
			m2.a=a; m2.b=b; m2.c=c; m2.d=d; m2.e=e; m2.f=f;
			xform = xform.multiply(m2);
			return transform.call(ctx,a,b,c,d,e,f);
		};
		var setTransform = ctx.setTransform;
		ctx.setTransform = function(a,b,c,d,e,f){
			xform.a = a;
			xform.b = b;
			xform.c = c;
			xform.d = d;
			xform.e = e;
			xform.f = f;
			return setTransform.call(ctx,a,b,c,d,e,f);
		};
		var pt  = svg.createSVGPoint();
		ctx.transformedPoint = function(x,y){
			pt.x=x; pt.y=y;
			return pt.matrixTransform(xform.inverse());
		}
  }

  render () {
    return (
      <div>
        <video ref="video" />
        <canvas ref="preview" width="420" height="240" onWheel={(evt) => this.onWheel(evt)} onClick={(evt) => this.onVideoClick(evt)} />
      </div>
    )
  }
}
