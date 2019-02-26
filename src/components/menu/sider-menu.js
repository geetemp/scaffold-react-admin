import React, { PureComponent } from "react";
import { Layout } from "antd";
import { urlToList, getMenuMatches } from "../utils";
import BaseMenu from "./base-menu";
const { Sider } = Layout;

/**
 * 获得菜单子节点
 * @memberof SiderMenu
 */
const getDefaultCollapsedSubMenus = (props, flatMenuKeys) => {
  const {
    location: { pathname }
  } = props;
  return urlToList(pathname)
    .map(item => getMenuMatches(flatMenuKeys, item)[0])
    .filter(item => item);
};

/**
 * Recursively flatten the data
 * [{path:string},{path:string}] => {path,path2}
 * @param  menu
 */
export const getFlatMenuKeys = menu =>
  menu.reduce((keys, item) => {
    keys.push(item.path);
    if (item.children) {
      return keys.concat(getFlatMenuKeys(item.children));
    }
    return keys;
  }, []);

export default class SideMenu extends PureComponent {
  flatMenuKeys = getFlatMenuKeys(this.props.menuData);

  state = {
    openKeys: getDefaultCollapsedSubMenus(this.props, this.flatMenuKeys)
  };

  static getDerivedStateFromProps(props, state) {
    const { pathname } = state;
    if (props.location.pathname !== pathname) {
      return {
        pathname: props.location.pathname,
        openKeys: getDefaultCollapsedSubMenus(
          props,
          getFlatMenuKeys(props.menuData)
        )
      };
    }
    return null;
  }

  isMainMenu = key => {
    const { menuData } = this.props;
    return menuData.some(item => {
      if (key) {
        return item.key === key || item.path === key;
      }
      return false;
    });
  };

  handleOpenChange = openKeys => {
    const moreThanOne =
      openKeys.filter(openKey => this.isMainMenu(openKey)).length > 1;
    this.setState({
      openKeys: moreThanOne ? [openKeys.pop()] : [...openKeys]
    });
  };

  render() {
    const { collapsed, theme, logo, onCollapse, userAuth } = this.props;
    const { openKeys } = this.state;
    const siderToMenuProps = collapsed ? {} : { openKeys };
    console.log(openKeys, siderToMenuProps, "siderMenuOpenKeys");
    return (
      <Sider
        trigger={null}
        breakpoint="xxl"
        width={200}
        collapsible
        onCollapse={onCollapse}
        collapsed={collapsed}
        theme={theme}
        // style={{zIndex: "2000"}}
      >
        <div className="logo" id="logo">
          {logo}
        </div>
        <BaseMenu
          {...siderToMenuProps}
          handleOpenChange={this.handleOpenChange}
          onOpenChange={this.handleOpenChange}
          {...this.props}
          userAuth={userAuth}
          mode="inline"
          className="base-menu"
        />
      </Sider>
    );
  }
}
