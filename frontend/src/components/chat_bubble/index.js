const C = require("./stylesheet");
const cx = require("classnames/bind").bind(C);
import React from "react";

export default props => (
  <div className={C.root}>
    <div className={cx("bubble", {me: props.me, them: !props.me})}>
      {props.children}
    </div>
  </div>
);
