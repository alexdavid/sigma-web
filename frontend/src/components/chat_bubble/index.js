const C = require("./stylesheet");
const cx = require("classnames/bind").bind(C);
import React from "react";
import {extname} from "path";

const TextBubble = props => (
  <div className={C.root}>
    <div className={cx("bubble", {me: props.me, them: !props.me})}>
      {props.children}
    </div>
  </div>
);

const ImgBubble = props => (
  <div className={C.root}>
    <div className={cx("bubble", "img", {me: props.me, them: !props.me})}>
      <img src={props.src} />
    </div>
  </div>
)

const VideoBubble = props => (
  <div className={C.root}>
    <div className={cx("bubble", "img", {me: props.me, them: !props.me})}>
      <video controls src={props.src} />
    </div>
  </div>
)

export default props => {
  if (!props.src) return <TextBubble {...props}>{props.text}</TextBubble>

  switch (extname(props.src)) {
    case ".bmp":
    case ".gif":
    case ".jpeg":
    case ".jpg":
    case ".png":
    case ".svg":
      return <ImgBubble {...props} />
    case ".avi":
    case ".mov":
    case ".mp4":
    case ".ogg":
      return <VideoBubble {...props} />
    default:
      return (
        <TextBubble {...props}>
          <a href={props.src}>Attachment</a>
        </TextBubble>
      );
  }
}
