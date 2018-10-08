/**
 * Created by common on 2017/8/1.
 */
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import store from "redux/store";
import { checkLogin } from "redux/actions/user";

/**
 * 访问页面时获取用户信息
 * @param requireLogin 是否要求登录
 * @param PageComponent 页面组件
 */
export default (requireLogin = false) => PageComponent => {
  class Restricted extends Component {
    componentWillMount() {
      this.checkAuthentication(this.props);
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.location !== this.props.location) {
        this.checkAuthentication(nextProps);
      }
    }

    checkAuthentication(params) {
      const { history, location } = params;
      store.dispatch(checkLogin()).then(re => {
        if (re.code === 5112) {
          requireLogin
            ? history.replace({
                pathname: "/login",
                state: { target: `${location.pathname}` }
              })
            : void 0;
        }
      });
    }

    render() {
      return <PageComponent {...this.props} />;
    }
  }
  return withRouter(Restricted);
};
