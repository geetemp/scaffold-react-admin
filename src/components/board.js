import React from "react";
import { array, func } from "prop-types";
import Square from "./square";

export default class Board extends React.Component {
  // Declare propTypes as static properties as early as possible
  static propTypes = { squares: array, onClick: func };

  // Default props below propTypes
  static defaultProps = { squares: Array(9).fill(null), onClick: () => {} };

  renderSquare = i => (
    <Square
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
    />
  );

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
