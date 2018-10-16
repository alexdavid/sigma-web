import Main from "./components/main";
import React from "react";
import reactDom from "react-dom";

const root = document.createElement("div");
document.body.appendChild(root);
reactDom.render(<Main />, root);
