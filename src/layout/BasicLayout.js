import React from "react";
import { Link } from "react-router-dom";
import { Layout, Menu, Spin } from "antd";
import pathToRegexp from "path-to-regexp";
import AuthCheck from "components/Auth";
// import Footer from "./Footer";
import SiderMenu from "components/Menu/SiderMenu";
import Exception403 from "pages/exception/403";

const { Header, Content } = Layout;

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

export default class BasicLayout extends React.PureComponent {
  // state = {
  //   rendering: true,
  // };

  breadcrumbNameMap = this.getBreadcrumbNameMap();

  /**
   * 获取面包屑映射
   * @param {Object} menuData 菜单配置
   */
  getBreadcrumbNameMap() {
    const routerMap = {};
    const mergeMenuAndRouter = data => {
      data.forEach(menuItem => {
        if (menuItem.children) {
          mergeMenuAndRouter(menuItem.children);
        }
        // Reduce memory usage
        routerMap[menuItem.path] = menuItem;
      });
    };
    mergeMenuAndRouter(this.getMenuData());
    return routerMap;
  }

  //找出当前路径下route配置
  matchParamsPath = pathname => {
    const pathKey = Object.keys(this.breadcrumbNameMap).find(key =>
      pathToRegexp(key).test(pathname)
    );
    return this.breadcrumbNameMap[pathKey];
  };

  //获取侧边菜单数据
  getMenuData() {
    const {
      route: { routes }
    } = this.props;
    return formatter(routes);
  }

  getContext() {
    const { location } = this.props;
    return {
      location,
      breadcrumbNameMap: this.breadcrumbNameMap
    };
  }

  render() {
    const {
      route,
      children,
      location: { pathname }
    } = this.props;
    const menuData = this.getMenuData();
    const routerConfig = this.matchParamsPath(pathname);
    return (
      <Layout>
        <SiderMenu
          // logo={logo}
          // Authorized={Authorized}
          // theme={navTheme}
          onCollapse={this.handleMenuCollapse}
          menuData={menuData}
          {...this.props}
        />
        <Layout
          style={{
            // ...this.getLayoutStyle(),
            minHeight: "100vh"
          }}
        >
          {/* <Header
            menuData={menuData}
            handleMenuCollapse={this.handleMenuCollapse}
            // logo={logo}
            {...this.props}
          /> */}
          <Header />
          <Content
            style={
              {
                // ...this.getContentStyle()
              }
            }
          >
            <AuthCheck
              authority={routerConfig.authority}
              noMatch={<Exception403 />}
            >
              {children}
            </AuthCheck>
          </Content>
          {/* <Footer /> */}
        </Layout>
      </Layout>
    );
  }
}
