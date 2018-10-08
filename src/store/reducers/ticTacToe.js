import Model from "../Model";

export default Model.getInstance(
  class extends Model {
    namespace = "TicTacToe";
    
    state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      historySelectText: "",
    };

    actions = {
      async handleClickWithout(index) {
        return await new Promise((resolve, reject) => {
          setTimeout(() => {
            this.dispatch({
              type: "TicTacToe/handleClick",
              payload: index
            });
            resolve("complete");
          }, 1000);
        });
      }
    };

    reducers = {
      handleClick(state, { payload: index }) {
        const history = state.history.slice(0, state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[index]) {
          return state;
        }
        squares[index] = state.xIsNext ? "X" : "O";
        return {
          ...state,
          history: history.concat([
            {
              squares
            }
          ]),
          stepNumber: history.length,
          xIsNext: !state.xIsNext
        };

        /**
         * 计算胜利者
         */
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
            if (
              squares[a] &&
              squares[a] === squares[b] &&
              squares[a] === squares[c]
            ) {
              return squares[a];
            }
          }
          return null;
        }
      },

      jumpTo(state, { payload: step }) {
        return {
          ...state,
          stepNumber: step,
          xIsNext: step % 2 === 0
        };
      }
    };
  }
);
