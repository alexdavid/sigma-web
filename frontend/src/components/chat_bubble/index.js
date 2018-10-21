const C = require("./stylesheet");
const cx = require("classnames/bind").bind(C);
import React from "react";

export const TextBubble = props => (
  <div className={C.root}>
    <div className={cx("bubble", {me: props.me, them: !props.me})}>
      {props.children}
    </div>
  </div>
);

export const ImgBubble = props => (
  <div className={C.root}>
    <div className={cx("bubble", "img", {me: props.me, them: !props.me})}>
      <img className={C.img} src={props.img} />
    </div>
  </div>
)
