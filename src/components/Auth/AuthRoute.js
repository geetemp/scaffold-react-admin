import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import AuthCheck from './AuthCheck';

// TODO 预备使用，动态配置？
const AuthCheckRoute = ({ component: Component, render, authority, redirectPath, ...rest }) => (
  <AuthCheck
    authority={authority}
    noMatch={<Route {...rest} render={() => <Redirect to={{ pathname: redirectPath }} />} />}
  >
    <Route {...rest} render={props => (Component ? <Component {...props} /> : render(props))} />
  </AuthCheck>
);

export default AuthCheckRoute;
