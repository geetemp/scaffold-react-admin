import React from "react";
import { string, func } from "prop-types";

// eslint-disable-next-line no-use-before-define
Square.propTypes = {
  onClick: func.isRequired,
  value: string
};

// eslint-disable-next-line no-use-before-define
Square.defaultProps = {
  value: ""
};

function Square({ onClick, value = "" }) {
  return (
    <React.Fragment>
      <button className="square" onClick={onClick}>
        {value}
      </button>
      <style jsx>
        {`
          .square {
            background: #fff;
            border: 1px solid #999;
            float: left;
            font-size: 24px;
            font-weight: bold;
            line-height: 34px;
            height: 34px;
            margin-right: -1px;
            margin-top: -2px;
            padding: 0;
            text-align: center;
            width: 34px;
          }

          .square:focus {
            outline: none;
          }
        `}
      </style>
    </React.Fragment>
  );
}

export default Square;
