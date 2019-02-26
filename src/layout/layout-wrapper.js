import React, { PureComponent } from "react";
import { connect } from "react-redux";
import userModel from "store/reducers/user";

/**
 * @requireLogin 是否要求登陆才能访问控制台
 * @Layout 页面布局组件
 */
export default (requireLogin = true) => Layout => {
  return connect(
    null,
    { isLogin: userModel.actions.isLogin }
  )(
    class extends PureComponent {
      componentWillMount() {
        if (requireLogin) this.props.isLogin();
      }

      //获取侧边菜单数据
      getMenuData() {
        const {
          route: { routes }
        } = this.props;
        return formatter(routes);
      }

      render() {
        const menuData = this.getMenuData();
        const props = { ...this.props, menuData };
        return <Layout {...props} />;
      }
    }
  );
};

// Conversion router to menu.
function formatter(data, parentAuthority) {
  return data.map(item => {
    const result = {
      ...item,
      authority: item.authority || parentAuthority
    };
    if (item.routes) {
      const children = formatter(item.routes, item.authority);
      // Reduce memory usage
      result.children = children;
    }
    delete result.routes;
    return result;
  });
}
