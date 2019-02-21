import React from "react";
import { Switch, Route } from "react-router-dom";
import SimpleLayout from "layout/simple-layout";
import UserLayout from "layout/UserLayout";
import UserLogin from "pages/user/login";
import { Exception404, Exception500 } from "components/Exception";

const authorities = ["admin"];

const Routes = () => (
  <Switch>
    <Route path="/user" component={UserLayout}>
      <Route path="/user" redirect="/user/login" exact={true} />
      <Route path="/user/login" component={UserLogin} />
    </Route>
    <Route path="/404" component={Exception404} />
    <Route path="/500" component={Exception500} />
    <Route path="/" component={SimpleLayout} authority={authorities}>
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
      <Route component={Exception404} />
    </Route>
  </Switch>
);

export default Routes;
