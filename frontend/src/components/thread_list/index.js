const C = require("./stylesheet");
const cx = require("classnames/bind").bind(C);
import React from "react";
import {getChats} from "../../api";

const ThreadListItem = props => (
  <div className={cx("threadListItem", {selected: props.selected})} onClick={props.onClick}>
    <div className={C.avatar}>{props.displayName.substr(-4)}</div>
    <div>{props.displayName}</div>
  </div>
);

export default class ThreadList extends React.Component {

  constructor() {
    super();
    this.update = this.update.bind(this);
    this.state = {
      err: null,
      threads: [],
    };
  }

  componentDidMount() {
    this.update();
  }

  update() {
    getChats()
      .then(threads => this.setState({threads}))
      .catch(err => this.setState({err}));
  }

  render() {
    if (this.state.err) return (
      <div>{this.state.err.toString()}</div>
    );

    return (
      <div className={C.root}>
        {this.state.threads.map(t => (
          <ThreadListItem
            key={t.id}
            selected={t.id === this.props.chatId}
            onClick={e => this.props.onChangeThread(t.id)}
            displayName={t.displayName}
          />
        ))}
      </div>
    );
  }
}
