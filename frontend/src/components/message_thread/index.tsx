const C = require("./stylesheet");
import * as React from "react";
import ChatBubble from "../chat_bubble";
import {getMessages, Message} from "../../api";

function groupMessages() {}

export default (props: {
  chatId: number,
}) => {
  const [messages, setMessages] = React.useState<Array<Message>>([]);
  const [err, setErr] = React.useState<Error|null>(null);

  const scrollToBottom = () => {};

  const pollMessages = (scrollView: boolean) => {
    getMessages(props.chatId)
      .then(setMessages)
      .then(() => {scrollView && scrollToBottom()})
      .catch(setErr)
  }

  React.useEffect(() => {
    pollMessages(true);
    const interval = setInterval(() => {pollMessages(false)}, 1000);
    return () => {clearInterval(interval)};
  });
}

// export default class MessageThread extends React.Component {
//   constructor() {
//     super();
//     this.update = this.update.bind(this);
//     this.state = {
//       err: null,
//       messageGroups: [],
//     };
//   }
//
//   componentDidMount() {
//     this.update(true);
//     this.interval = setInterval(() => this.update(false), 1000);
//   }
//
//   componentWillUnmount() {
//     clearInterval(this.interval);
//   }
//
//   componentDidUpdate(oldProps) {
//     if (oldProps.chatId === this.props.chatId) return;
//     this.update(true);
//   }
//
//   update(scrollToBottom) {
//     getMessages(this.props.chatId)
//       .then(messageGroups => this.setState({messageGroups}))
//       .then(() => scrollToBottom && this.scrollToBottom())
//       .catch(err => this.setState({err}));
//   }
//
//   scrollToBottom() {
//     this.refs.root.scrollTo(0, this.refs.root.scrollHeight);
//   }
//
//   render() {
//     if (this.state.err) return (
//       <div>{this.state.err.toString()}</div>
//     );
//
//     return (
//       <div className={C.root} ref="root">
//         {this.state.messageGroups.map((g, key) => (
//           <div key={key}>
//             {g.map(m =>
//               <ChatBubble key={m.id} me={m.fromMe} src={m.src} text={m.text} />
//             )}
//           </div>
//         ))}
//       </div>
//     );
//   }
// }
