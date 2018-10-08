import Model from "../Model";

export default Model.getInstance(
  class extends Model {
    namespace = "TicTacToeChild";

    state = {
      param: "",
      pathname: ""
    };
  }
);
