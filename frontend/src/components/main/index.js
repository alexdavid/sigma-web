const C = require("./stylesheet");
import MessageThread from "../message_thread";
import React from "react";
import Send from "../send";
import Threadlist from "../thread_list";

export default class Main extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedChatId: null,
    };
  }

  render() {
    const chatId = this.state.selectedChatId;
    return (
      <div>
        <div className={C.leftPanel}>
          <Threadlist chatId={chatId} onChangeThread={selectedChatId => this.setState({selectedChatId})} />
        </div>
        <div className={C.rightPanel}>
          {this.state.selectedChatId && <MessageThread chatId={chatId} />}
        </div>
        <div className={C.sendPanel}>
          {this.state.selectedChatId && <Send chatId={chatId} />}
        </div>
      </div>
    );
  }
}
