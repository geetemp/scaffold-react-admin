import React from "react";
// import { renderRoutes } from "react-router-config";

import configureStore from "store";
import routes from "routes";
import ticTacToeModel from "store/reducers/ticTacToe";
import ticTacToeChildModel from "store/reducers/ticTacToeChild";
import styles from "assets/styles/global.scss";
import createStaticRoutes from "utils/createStaticRoutes";
import renderRoutes  from "utils/renderRoutes";

configureStore.pushModel(ticTacToeModel);
configureStore.pushModel(ticTacToeChildModel);

let staticRoutes = createStaticRoutes(routes());

const App = () => (
  <React.Fragment>
    {renderRoutes(staticRoutes)}
    <style jsx global>
      {styles}
    </style>
  </React.Fragment>
);

export default App;
export { configureStore, staticRoutes };
