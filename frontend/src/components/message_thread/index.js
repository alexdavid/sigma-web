const C = require("./stylesheet");
import React from "react";
import ChatBubble from "../chat_bubble";

export default class MessageThread extends React.Component {
  constructor() {
    super();
    this.update = this.update.bind(this);
    this.state = {
      err: null,
      messageGroups: [],
    };
  }

  componentDidMount() {
    this.update();
  }

  componentDidUpdate(oldProps) {
    if (oldProps.chatId === this.props.chatId) return;
    this.update();
  }

  update() {
    fetch(`/api/chats/${this.props.chatId}`)
      .then(res => res.json())
      .then(messages => this.groupMessages(messages))
      .then(messageGroups => this.setState({messageGroups}))
      .then(() => this.scrollToBottom())
      .catch(err => this.setState({err}));
  }

  scrollToBottom() {
    this.refs.root.scrollTo(0, this.refs.root.scrollHeight);
  }

  groupMessages(messages) {
    let currentGroup = [];
    const groups = [currentGroup];
    for (let i = messages.length - 1; i >=0; i--) {
      let message = messages[i];
      if (currentGroup.length > 0 && currentGroup[0].fromMe != message.fromMe) {
        currentGroup = [];
        groups.push(currentGroup);
      }
      currentGroup.push(message)
    }
    return groups;
  }

  render() {
    if (this.state.err) return (
      <div>{this.state.err.toString()}</div>
    );

    return (
      <div className={C.root} ref="root">
        {this.state.messageGroups.map((g, key) => (
          <div key={key}>
            {g.map(m => (
              <ChatBubble key={m.id} me={m.fromMe}>{m.text}</ChatBubble>
            ))}
          </div>
        ))}
      </div>
    );
  }
}
