import React from 'react';

export default class Timer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {seconds: props.seconds};
  }

  onTimerTick (seconds) {}
  onTimerEnd () {}

  componentDidMount () {
    this.intervalID = setInterval(() => {
      if (this.state.seconds > 0) {
        this.onTimerTick(this.state.seconds);
        this.tick();
      } else {
        clearInterval(this.intervalID);
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
