const C = require("./stylesheet");
import React from "react";
import {sendMessage} from "../../api";

export default class Send extends React.Component {
  constructor() {
    super();
    this.state = {
      err: null,
      message: "",
    };
    this.sendMessage = this.sendMessage.bind(this);
    this.updateMessage = this.updateMessage.bind(this);
  }

  updateMessage(e) {
    this.setState({ message: e.target.value });
  }

  sendMessage(e) {
    e.preventDefault();
    sendMessage(this.props.chatId, this.state.message)
      .then(() => this.setState({ message: "" }))
      .catch(err => this.setState({err}));
  }

  render() {
    if (this.state.err) return (
      <div>{this.state.err.toString()}</div>
    );

    return (
      <div className={C.root}>
        <form onSubmit={this.sendMessage}>
          <input
            onChange={this.updateMessage}
            value={this.state.message}
            placeholder="Send Message" />
        </form>
      </div>
    );
  }
}
