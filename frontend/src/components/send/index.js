const C = require("./stylesheet");
import React from "react";

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
    fetch(`/api/chats/${this.props.chatId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({message: this.state.message}),
    })
      .then(res => res.json())
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
