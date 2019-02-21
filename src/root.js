import App, { configureStore } from "./App";
import React from "react";
import { Provider } from "react-redux";
import { Router } from "react-router";
import createHashHistory from "history/createHashHistory";
import errorBoundary from "utils/hoc/errorBoundary";
import InitUserData from "utils/hoc/init-user-data";
import { ClientErrorFallback } from "components/Exception";

export const store = configureStore.createStore(window.__PRELOADED_STATE__);
export const history = new createHashHistory();

const ErrorBoundary = errorBoundary(() => (
  <ClientErrorFallback history={history} />
));

export default function root() {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <InitUserData store={store}>
          <Router history={history}>
            <App />
          </Router>
        </InitUserData>
      </ErrorBoundary>
    </Provider>
  );
}
