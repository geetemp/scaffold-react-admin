import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { Icon, Dropdown, Avatar, Menu, Button } from "antd";
import BasicLayout from "./BasicLayout";
import Authorized from "utils/Authorized";
import userModel from "store/reducers/user";
import globalModel from "store/reducers/global";
import { history } from "root.js";
import "./simple-layout.scss";

@connect(
  null,
  { isLogin: userModel.actions.isLogin }
)
export default class SimpleLayout extends PureComponent {
  componentWillMount() {
    this.props.isLogin();
  }

  render() {
    const { route } = this.props;
    const logo = (
      <h1 className="simple-layout-logo">
        <img src={require("assets/imgs/logo.svg")} />
      </h1>
    );
    return (
      <Authorized
        authority={route.authority}
        noMatch={<Redirect to="/user/login" />}
      >
        <BasicLayout
          logo={logo}
          className="simple-layout"
          customHeader={<CustomHeader />}
          {...this.props}
        />
      </Authorized>
    );
  }
}

@connect(
  ({ user }) => {
    return {
      username: user.name,
      avatar: user.avatar
    };
  },
  {
    logout: userModel.actions.logout
  }
)
class CustomHeader extends PureComponent {
  render() {
    const { username, avatar, logout } = this.props;

    const menu = (
      <Menu className="user-down-menu" selectedKeys={[]}>
        <Menu.Item key="userCenter">
          <Link to="/center">
            <Icon type="user" style={{ marginRight: 5 }} />
            个人中心
          </Link>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <span onClick={logout}>
            <Icon type="logout" style={{ marginRight: 5 }} />
            退出登录
          </span>
        </Menu.Item>
      </Menu>
    );

    return (
      <React.Fragment>
        <div className="simple-layout-user right">
          <Dropdown overlay={menu}>
            <span className="account">
              <Avatar
                size="small"
                className="avatar"
                src={avatar}
                alt="avatar"
              />
              <span className="name">{username}</span>
            </span>
          </Dropdown>
        </div>
      </React.Fragment>
    );
  }
}
