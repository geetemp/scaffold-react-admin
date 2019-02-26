import React from "react";
import { Layout } from "antd";
import pathToRegexp from "path-to-regexp";
import Authorized from "utils/authorized";
import { Exception403 } from "components/exception";

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

/**
 * content with auth
 */
export default class ContentBaseAuth extends React.PureComponent {
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

  render() {
    const {
      className,
      children,
      location: { pathname }
    } = this.props;
    const routerConfig = this.matchParamsPath(pathname);
    return (
      <Content className={className}>
        <Authorized
          authority={routerConfig.authority}
          noMatch={<Exception403 />}
        >
          {children}
        </Authorized>
      </Content>
    );
  }
}
