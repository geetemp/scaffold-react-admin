import React, { PureComponent } from "react";
import { Redirect } from "react-router-dom";
import { Layout } from "antd";
import Authorized from "utils/authorized";
import BaseMenu from "components/menu/base-menu";
import Content from "./content";
import layoutWrapper from "./layout-wrapper";
import "./header-nav-layout.scss";

const { Header: AntHeader } = Layout;

export default layoutWrapper()(
  class HeaderNavLayout extends PureComponent {
    render() {
      const {
        logo,
        customHeader,
        className,
        children,
        location,
        route,
        menuData
      } = this.props;
      return (
        <Authorized
          authority={route.authority}
          noMatch={<Redirect to="/user/login" />}
        >
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
        </Authorized>
      );
    }
  }
);

class Header extends PureComponent {
  render() {
    const { customHeader, menuData, logo, roles } = this.props;
    return (
      <AntHeader style={{ padding: 0 }} className="layout-header">
        <div id="header">
          <logo />
          <BaseMenu
            menuData={menuData}
            roles={roles}
            location={this.props.location}
            mode="horizontal"
          />
          {customHeader}
        </div>
      </AntHeader>
    );
  }
}
