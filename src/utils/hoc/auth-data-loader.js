import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { matchRoutes } from "react-router-config";
/**
 * 权限数据加载器
 */
export default PageComponent => {
  class AuthDataLoader extends Component {
    componentDidMount() {
      const { routes, location, store } = this.props;
      const matchedRoutes = matchRoutes(routes, location.pathname);
      matchedRoutes.map(({ route, match }) => {
        return route.loadAuthData
          ? route.loadAuthData(match, store)
          : Promise.resolve(null);
      });
    }

    render() {
      return <PageComponent {...this.props} />;
    }
  }
  return withRouter(AuthDataLoader);
};
