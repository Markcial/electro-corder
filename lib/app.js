import React from 'react';
import Timer from "./ui/timer"
import Button from "./ui/core"

class App extends React.Component {
  render () {
    return (
      <div>
        <h1>Recorder</h1>
        <Button />
      </div>
    );
  }
}

window.onload = function () {
  React.render(<App />, document.body);
}
