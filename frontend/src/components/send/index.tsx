const C = require("./stylesheet");
import * as React from "react";
import {sendMessage} from "../../api";

export default (props: {
  chatId: number,
}) => {
  const [input, setInput] = React.useState("");
  const [err, setErr] = React.useState<Error|null>(null)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(props.chatId, input)
    .then(() => {setInput("")})
    .catch(setErr);
  };

  if (err != null) return <div>{err.toString()}</div>;

  return (
    <div className={C.root}>
      <form onSubmit={onSubmit}>
        <input
          onChange={e => {setInput(e.target.value)}}
          value={input}
          placeholder="Send Message" />
        </form>
      </div>
  );
}

//     // return (
//     //   <div className={C.root}>
//     //     <form onSubmit={this.sendMessage}>
//     //       <div className={C.message}>
//     //         <input
//     //           onChange={this.updateMessage}
//     //           value={this.state.message}
//     //           placeholder="Send Message" />
//     //       </div>
//     //     </form>
//     //     <div className={C.upload}>
//     //       <input
//     //         type="file"
//     //         onChange={e => sendMessage(this.props.chatId, "", e.target.files[0])}
//     //       />
//     //     </div>
//     //   </div>
//     // );
//   }
// }
