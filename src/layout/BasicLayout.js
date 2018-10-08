import React from "react";
import pathToRegexp from 'path-to-regexp';
import AuthCheck from "components/Auth";
import SideBar from "components/SideMenu/SideBar";
import { Layout  } from 'antd';

const { Header, Content } = Layout;

export default class BasicLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    this.breadcrumbNameMap = this.getBreadcrumbNameMap();
  }

  // 路由层级平面化
  getBreadcrumbNameMap() {
    const { route } = this.props;
    const routerMap = {};
    routerMap[route.path] = route;  // 把顶层的路由也要加进去
    const mergeMenuAndRouter = data => {
      data.forEach(menuItem => {
        if (menuItem.routes) {
          mergeMenuAndRouter(menuItem.routes);
        }
        // Reduce memory usage
        routerMap[menuItem.path] = menuItem;
      });
    };
    mergeMenuAndRouter(route.routes);
    return routerMap;
  }

  getRouterLink = pathname => {
    const pathKey = Object.keys(this.breadcrumbNameMap).find(key =>
      pathToRegexp(key).test(pathname)
    );
    return this.breadcrumbNameMap[pathKey];
  }

  render() {
    const { route, children, location: { pathname } } = this.props;
    const routerLink = this.getRouterLink(pathname);
    return (
      <AuthCheck authority={route.authority} noMatch={<div>no result</div>} >
        <Layout style={{ minHeight: '100vh' }}>
          <Layout>
            <Header></Header>
            <Content style={{display: "flex"}}>
              <Layout>
                <SideBar style={{height: "100%"}} menuData={route} {...this.props}></SideBar>
                <Layout>
                  <AuthCheck authority={routerLink.authority} noMatch={<div>no result</div>} >{children}</AuthCheck>
                </Layout>
              </Layout>
            </Content>
            {/* <Footer style={{ textAlign: 'center' }}>
              Ant Design ©2018 Created by Ant UED
            </Footer> */}
          </Layout>
        </Layout>
      </AuthCheck>
    );
  }
}
