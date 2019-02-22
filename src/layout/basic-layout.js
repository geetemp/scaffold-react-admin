import React from "react";
import { Layout } from "antd";
import { connect } from "react-redux";
import pathToRegexp from "path-to-regexp";
import Authorized from "utils/authorized";
import SiderMenu from "components/Menu/sider-menu";
import { Exception403 } from "components/exception";
import globalModel from "store/reducers/global";
import Header from "./header";

const { Content } = Layout;

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

@connect(
  ({ global }) => {
    return { ...global };
  },
  {
    changeLayoutCollapsed: globalModel.actions["changeLayoutCollapsed"]
  }
)
export default class BasicLayout extends React.PureComponent {
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

  handleMenuCollapse = collapsed => {
    const { changeLayoutCollapsed } = this.props;
    changeLayoutCollapsed(collapsed);
  };

  render() {
    const {
      logo,
      customHeader,
      className,
      children,
      location: { pathname },
      roles
    } = this.props;
    const menuData = this.getMenuData();
    const routerConfig = this.matchParamsPath(pathname);
    return (
      <Layout className={className}>
        <SiderMenu
          logo={logo}
          theme={"dark"}
          userAuth={roles}
          onCollapse={this.handleMenuCollapse}
          menuData={menuData}
          {...this.props}
        />
        <Layout
          style={{
            minHeight: "100vh"
          }}
          className="layout-content"
        >
          <Header
            handleMenuCollapse={this.handleMenuCollapse}
            logo={logo}
            customHeader={customHeader}
            {...this.props}
          />
          <Content>
            <Authorized
              authority={routerConfig.authority}
              noMatch={<Exception403 />}
            >
              {children}
            </Authorized>
          </Content>
        </Layout>
      </Layout>
    );
  }
}
