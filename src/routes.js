import React from "react";
import { Switch, Route } from "react-router-dom";

import Index from "pages/Index";
import TicTacToe from "pages/TicTacToe.js";

import BasicLayout from "layout/BasicLayout";
import UserLayout from "layout/UserLayout";


// 使用component, render渲染子路由需要单独写renderroute
const Routes = () => (
  <Switch>
    <Route path="/user" component={UserLayout} >
      
    </Route>
    <Route path="/" component={BasicLayout} authority={['a']}>
      <Route path="/" redirect="/test/1" exact={true} />
      <Route path="/test" name="系统管理">
        <Route path="/test/1" component={Index} authority={['a']} name="系统管理123">
          <Route path="/test/1/1" component={TicTacToe} authority={['admin','a']}></Route>
        </Route>
      </Route>
    </Route>
  </Switch>
);

export default Routes;
