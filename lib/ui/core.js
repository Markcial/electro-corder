import React from 'react';

export default class Timer extends React.Component {
  constructor() {
    super();
    this.state = { count: 0 };
  }

  componentDidMount () {
    setInterval(() => {
      this.tick();
    }, 1000);
  }

  tick() {
    this.setState({ count: this.state.count + 1 });
  }

  render() {
    return (
      <div onClick={this.tick.bind(this)}>
        Clicks: {this.state.count}
      </div>
    );
  }
}
