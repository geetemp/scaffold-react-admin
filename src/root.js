import App, { configureStore } from "./App";
import React from "react";
import { Provider } from "react-redux";
import { Router } from "react-router";
import createBrowserHistory from "history/createBrowserHistory";

const store = configureStore.createStore(window.__PRELOADED_STATE__);
const history = new createBrowserHistory();

export default function root() {
  return (
    <Provider store={store}>
      <Router history={history}>
        <App />
      </Router>
    </Provider>
  );
}
