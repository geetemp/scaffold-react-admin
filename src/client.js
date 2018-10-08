import React from "react";
import { render } from "react-dom";
import root from "./root";

const client = Component => {
  render(<Component />, document.getElementById("root"));
};

client(root);

if (module.hot) {
  module.hot.accept("./root", () => {
    client(require("./root").default);
  });
}
