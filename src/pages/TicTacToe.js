import React, { Component } from "react";
import Board from "components/board";
import { renderRoutes } from "react-router-config";
import { connect } from "react-redux";
import ticTacToeModel from "store/reducers/ticTacToe";
import styles from "./TicTacToe.scss";

@connect(
  ({ TicTacToe }) => {
    return { ...TicTacToe };
  },
  {
    ...ticTacToeModel.actions
  }
)
export default class TicTacToe extends Component {
  static namespace = "TicTacToe";

  static async getInitialProps({ pathname, query, req, res }) {
    return { history: [{ squares: Array(9).fill("X", 7, 9) }] };
  }

  // componentDidMount() {}

  render() {
    const {
      history,
      stepNumber,
      xIsNext,
      handleClickWithout,
      jumpTo,
      route
    } = this.props;
    const current = history[stepNumber];
    // eslint-disable-next-line
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      const desc = move ? `Go to move #${move}` : "Go to game start";
      return (
        <li key={desc}>
          <button onClick={() => jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = `Winner: ${winner}`;
    } else {
      status = `Next player: ${xIsNext ? "X" : "O"}`;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => {
              handleClickWithout(i);
            }}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
        <div>{renderRoutes(route.routes)}</div>
        <style jsx>{styles}</style>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
