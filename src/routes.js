import React from "react";
import { Switch, Route } from "react-router-dom";
import HeaderNavLayout from "layout/header-nav-layout";
import SiderNavLayout from "layout/sider-nav-layout";
import UserLayout from "layout/user-layout";
import UserLogin from "pages/user/login";
import { Exception404, Exception500 } from "components/exception";

const authorities = ["admin"];

const Routes = () => (
  <Switch>
    <Route path="/user" component={UserLayout}>
      <Route path="/user" redirect="/user/login" exact={true} />
      <Route path="/user/login" component={UserLogin} />
    </Route>
    <Route path="/404" component={Exception404} />
    <Route path="/500" component={Exception500} />
    <Route path="/" component={HeaderNavLayout} authority={authorities}>
      <Route path="/" redirect="/manage" exact={true} />
      <Route
        path="/manage"
        authority={authorities}
        icon="setting"
        name="系统管理"
      >
        <Route path="/manage" redirect="/manage/personal" exact={true} />
        <Route
          path="/manage/personal"
          component={() => <p>个人信息页，admin角色可以访问</p>}
          name="个人信息"
        />
        <Route
          path="/manage/theme"
          component={() => <div>主题设置，conunselor角色可以访问</div>}
          authority={["conunselor"]}
          name="主题设置"
        />
      </Route>
      <Route path="/cc" authority={authorities} icon="user" name="客户管理">
        <Route path="/cc" redirect="/manage/personal" exact={true} />
        <Route
          path="/cc/personal"
          component={() => <p>个人信息页，admin角色可以访问</p>}
          name="客户信息"
        />
        <Route
          path="/cc/theme"
          component={() => <div>主题设置，conunselor角色可以访问</div>}
          authority={["conunselor"]}
          name="客户设置"
        />
      </Route>
      <Route component={Exception404} />
    </Route>
  </Switch>
);

export default Routes;
