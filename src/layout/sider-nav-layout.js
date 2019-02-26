import React, { PureComponent } from "react";
import { Layout, Icon } from "antd";
import { connect } from "react-redux";
import Authorized from "utils/authorized";
import SiderMenu from "components/menu/sider-menu";
import Content from "./content";
import globalModel from "store/reducers/global";
import "./sider-nav-layout.scss";

const { Header: AntHeader } = Layout;

@connect(
  ({ global }) => {
    return { ...global };
  },
  {
    changeLayoutCollapsed: globalModel.actions["changeLayoutCollapsed"]
  }
)
export default class SiderNavLayout extends React.PureComponent {
  //获取侧边菜单数据
  getMenuData() {
    const {
      route: { routes }
    } = this.props;
    return formatter(routes);
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
      location,
      roles,
      route
    } = this.props;
    const menuData = this.getMenuData();
    return (
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
    );
  }
}

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
