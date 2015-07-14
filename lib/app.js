import React from 'react';
import {Button, Preview, Timer} from "./ui/core"

class App extends React.Component {

  render () {
    return (
      <div>
        <h1>Recorder</h1>
        <Preview />
        <Timer ref="timer" />
        <Button click={(e) => {this.refs.timer.startTimer()}} />
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
