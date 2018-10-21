const C = require("./stylesheet");
import React from "react";
import {TextBubble, ImgBubble} from "../chat_bubble";
import {getMessages} from "../../api";

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
    this.update(true);
    this.interval = setInterval(() => this.update(false), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentDidUpdate(oldProps) {
    if (oldProps.chatId === this.props.chatId) return;
    this.update(true);
  }

  update(scrollToBottom) {
    getMessages(this.props.chatId)
      .then(messageGroups => this.setState({messageGroups}))
      .then(() => scrollToBottom && this.scrollToBottom())
      .catch(err => this.setState({err}));
  }

  scrollToBottom() {
    this.refs.root.scrollTo(0, this.refs.root.scrollHeight);
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
              m.img ? <ImgBubble key={m.id} me={m.fromMe} img={m.img} />
                    : <TextBubble key={m.id} me={m.fromMe}>{m.text}</TextBubble>
            ))}
          </div>
        ))}
      </div>
    );
  }
}
