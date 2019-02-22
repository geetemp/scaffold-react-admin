import React from "react";
import configureStore from "store";
import routes from "routes";
import createStaticRoutes from "utils/create-static-routes";
import renderRoutes from "utils/render-routes";
import "assets/styles/global.scss";

const requireModels = require.context("./store/reducers", false, /\.js$/);
requireModels.keys().forEach(filename => {
  configureStore.pushModel(requireModels(filename).default);
});

let staticRoutes = createStaticRoutes(routes());

const App = () => <React.Fragment>{renderRoutes(staticRoutes)}</React.Fragment>;

export default App;
export { configureStore, staticRoutes };
