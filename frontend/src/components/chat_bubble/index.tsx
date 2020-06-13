const C = require("./stylesheet");
const cx = require("classnames/bind").bind(C);
import * as React from "react";
import {extname} from "path";


const TextBubble = (props: {
  me: boolean,
  children: React.ReactNode,
}) => (
  <div className={C.root}>
    <div className={cx("bubble", {me: props.me, them: !props.me})}>
      {props.children}
    </div>
  </div>
);

const ImgBubble = (props: {
  me: boolean,
  src: string,
}) => (
  <div className={C.root}>
    <div className={cx("bubble", "img", {me: props.me, them: !props.me})}>
      <img src={props.src} />
    </div>
  </div>
);

const VideoBubble = (props: {
  me: boolean,
  src: string,
}) => (
  <div className={C.root}>
    <div className={cx("bubble", "img", {me: props.me, them: !props.me})}>
      <video controls src={props.src} />
    </div>
  </div>
);

export default (props: {
  me: boolean,
  text: string,
  src?: string,
}) => {
  const src = props.src;
  if (src == null) return <TextBubble {...props}>{props.text}</TextBubble>;

  switch (extname(src).toLowerCase()) {
    case ".bmp":
    case ".gif":
    case ".jpeg":
    case ".jpg":
    case ".png":
    case ".svg":
      return <ImgBubble me={props.me} src={src} />;
    case ".avi":
    case ".mov":
    case ".mp4":
    case ".ogg":
      return <VideoBubble me={props.me} src={src} />;
    default:
      return (
        <TextBubble {...props}>
          <a href={props.src}>Attachment</a>
        </TextBubble>
      );
  }
}
