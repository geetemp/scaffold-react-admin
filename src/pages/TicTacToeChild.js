import React from "react";
import { connect } from "react-redux";

function TicTacToeChild({ param, pathname }) {
  return (
    <p>
      {param},{pathname}
    </p>
  );
}
TicTacToeChild.namespace = "TicTacToeChild";
TicTacToeChild.getInitialProps = async function({ pathname, query, req, res }) {
  return { param: query.param, pathname };
};

export default connect(({ TicTacToeChild }) => {
  return { ...TicTacToeChild };
})(TicTacToeChild);
