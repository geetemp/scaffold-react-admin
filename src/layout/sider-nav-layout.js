import React, { PureComponent } from "react";
import { Redirect } from "react-router-dom";
import { Layout, Icon } from "antd";
import { connect } from "react-redux";
import Authorized from "utils/authorized";
import SiderMenu from "components/menu/sider-menu";
import Content from "./content";
import globalModel from "store/reducers/global";
import layoutWrapper from "./layout-wrapper";
import "./sider-nav-layout.scss";

const { Header: AntHeader } = Layout;

export default layoutWrapper()(
  connect(
    ({ global }) => {
      return { ...global };
    },
    {
      changeLayoutCollapsed: globalModel.actions["changeLayoutCollapsed"]
    }
  )(
    class SiderNavLayout extends React.PureComponent {
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
          location,
          roles,
          route,
          menuData
        } = this.props;
        return (
          <Authorized
            authority={route.authority}
            noMatch={<Redirect to="/user/login" />}
          >
            <Layout className={`sider-nav-layout ${className || ""}`}>
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
                <Content route={route} location={location}>
                  {children}
                </Content>
              </Layout>
            </Layout>
          </Authorized>
        );
      }
    }
  )
);

class Header extends PureComponent {
  toggle = () => {
    const { collapsed, handleMenuCollapse } = this.props;
    handleMenuCollapse(!collapsed);
  };

  render() {
    const { customHeader, collapsed } = this.props;
    return (
      <AntHeader style={{ padding: 0 }} className="layout-header">
        <div id="header">
          <Icon
            className="trigger"
            type={collapsed ? "menu-unfold" : "menu-fold"}
            onClick={this.toggle}
          />

          {customHeader}
        </div>
      </AntHeader>
    );
  }
}
