import React, { PureComponent } from "react";
import { Layout } from "antd";
import { connect } from "react-redux";
import Authorized from "utils/authorized";
import BaseMenu from "components/menu/base-menu";
import Content from "./content";
import "./header-nav-layout.scss";

const { Header: AntHeader } = Layout;

export default class HeaderNavLayout extends PureComponent {
  //获取侧边菜单数据
  getMenuData() {
    const {
      route: { routes }
    } = this.props;
    return formatter(routes);
  }

  render() {
    const {
      logo,
      customHeader,
      className,
      children,
      location,
      roles,
      route
    } = this.props;
    const menuData = this.getMenuData();
    return (
      <Layout className={`header-nav-layout ${className || ""}`}>
        <Layout
          style={{
            minHeight: "100vh"
          }}
          className="layout-content"
        >
          <Header
            menuData={menuData}
            logo={logo}
            customHeader={customHeader}
            {...this.props}
          />
          <Content
            route={route}
            location={location}
            className="header-nav-layout-content"
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    );
  }
}

class Header extends PureComponent {
  render() {
    const { customHeader, menuData, logo } = this.props;
    return (
      <AntHeader style={{ padding: 0 }} className="layout-header">
        <div id="header">
          <logo />
          <BaseMenu
            menuData={menuData}
            location={this.props.location}
            mode="horizontal"
          />
          {customHeader}
        </div>
      </AntHeader>
    );
  }
}

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
