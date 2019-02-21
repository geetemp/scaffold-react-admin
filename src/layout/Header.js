import React, { PureComponent } from "react";
import { Layout, Icon } from "antd";
import "./Header.scss";
const { Header: AntHeader } = Layout;

export default class Header extends PureComponent {
  toggle = () => {
    const { collapsed, handleMenuCollapse } = this.props;
    handleMenuCollapse(!collapsed);
  };

  render() {
    const { customHeader, collapsed } = this.props;
    return (
      <AntHeader style={{ padding: 0 }} className="layout-header">
        <div className="header" id="header">
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
