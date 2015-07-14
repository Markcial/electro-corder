import React from 'react';
import range from '../misc/utils';

export default class Button extends React.Component {

  constructor(props) {
    super(props);
    this.state = {label: props.label};
  }

  onClick (event) {
    console.log(event);
  }

  render() {
    return (
      <button onClick={this.onClick.bind(this)}>{this.state.label}</button>
    );
  }
}
Button.propTypes = { label: React.PropTypes.string };
Button.defaultProps = { label: 'Button' };

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
