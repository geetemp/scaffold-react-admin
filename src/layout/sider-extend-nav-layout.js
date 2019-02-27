import React, { PureComponent } from "react";
import { Layout } from "antd";
import { connect } from "react-redux";
import ExtendMenu from "components/Menu/extend-menu";
import Content from "./content";
import globalModel from "store/reducers/global";
import layoutWrapper from "./layout-wrapper";
import "./sider-extend-nav-layout.scss";
const { Header: AntHeader } = Layout;

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

export default layoutWrapper()(
  connect(
    ({ global }) => {
      return { ...global };
    },
    {
      changeLayoutCollapsed: globalModel.actions["changeLayoutCollapsed"]
    }
  )(
    class SiderExtendNavLayout extends React.PureComponent {
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
          <Layout className={`sider-extend-nav-layout ${className || ""}`}>
            <Layout
              style={{
                minHeight: "100vh"
              }}
              className="extend-layout"
            >
              <Header logo={logo} customHeader={customHeader} {...this.props} />
              <div className="extend-layout-content">
                <ExtendMenu
                  logo={logo}
                  theme={"dark"}
                  userAuth={roles}
                  menuData={menuData}
                  className="extend-menu"
                  {...this.props}
                />
                <Content route={route} location={location}>
                  {children}
                </Content>
              </div>
            </Layout>
          </Layout>
        );
      }
    }
  )
);

class Header extends PureComponent {
  render() {
    const { customHeader } = this.props;
    return (
      <AntHeader style={{ padding: 0 }} className="layout-header">
        <div id="header">{customHeader}</div>
      </AntHeader>
    );
  }
}
