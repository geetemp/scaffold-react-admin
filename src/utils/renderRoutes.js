import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

function renderRoutes(routes, extraProps = {}, switchProps = {}) {
  return routes ? (
    <Switch {...switchProps}>
      {routes.map((route, i) => {
        if (route.redirect) {
          return (
            <Redirect
              key={route.key || i}
              from={route.path}
              to={route.redirect}
              exact={route.exact}
              strict={route.strict}
            />
          );
        }
        return (
          <Route
            key={route.key || i}
            path={route.path}
            exact={route.exact}
            strict={route.strict}
            render={props => {
              const childRoutes = renderRoutes(
                route.routes,
                {} /* extraProps */,
                {
                  /* switchProps */
                  location: props.location
                }
              );
              if (route.component) {
                return (
                  <route.component {...props} {...extraProps} route={route}>
                    {childRoutes}
                  </route.component>
                );
              } else {
                return childRoutes;
              }
            }}
          />
        );
      })}
    </Switch>
  ) : null;
}

export default renderRoutes;
