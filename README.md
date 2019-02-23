## scaffold-react-ssr

react server side render 脚手架，抽象团队项目中的公共部件，沉淀技术方案实践，与技术规范。

- [Getting started](#Getting-started)
- [路由权限机制](#路由权限机制)
- [登录机制](#登录机制)
- [model 的使用](#model-的使用)
- [接口请求 fetch 的封装](#接口请求-fetch-的封装)
- [与 gee-ui 组件库集成开发](#与-gee-ui-组件库集成开发)
  - [安装 gee-ui](#安装-gee-ui)
  - [集成 gee-ui](#集成-gee-ui)
  - [定制 gee-ui 主题](#定制-gee-ui-主题)
- [文件/目录名规范](#文件/目录名规范)  
- [组件书写规范](#组件书写规范)
  - [function 组件编写](#function-组件编写)
  - [class 组件编写](#class-组件编写)  
- [技术栈](#技术栈)

### Getting started

克隆项目,修改项目文件夹名称，删除.git 文件

```bash
git clone git@github.com:geetemp/scaffold-react-ssr.git
rename scaffold-react-ssr [项目名称]
cd [项目名称]
del .git
```

安装依赖，并启动

```bash
yarn install
yarn start
```

### 路由权限机制
由于react-router4后就不支持嵌套路由了，但在类似ssr或者后台系统，需要全局配置、统一管理路由的情况下，就需要嵌套路由，所以我们通过技术手段恢复该功能；

后台系统的路由有权限要求，在全局配置路由的前提下，还需要增加权限的配置；

来看下我们路由配置的简单例子
```jsx
    <Route path="/" component={SimpleLayout} authority={authorities}>
      <Route
        path="/manage"
        authority={authorities}
        icon="setting"
        name="系统管理"
      >
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
    </Route>
```
我们把后台系统组件分成两种，一个是全局布局组件，另一个是页面组件，比如例子中的`SimpleLayout`是布局组件，`()=><p>个人信息页，admin角色可以访问</p>`是一个页面组件；

我们`页面组件的路由`配置成`布局组件路由`的子路由，就像这样
```jsx
    <Route path="/" component={SimpleLayout} authority={authorities}>
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
```
这个时候我们在浏览器地址栏键入`http://localhost:3000/manage/personal`可以访问到由布局组件和页面组件组合成的页面了；

我们知道后台系统一般都有一个全局导航，同样也需要配置路由信息才能生成，何不把导航需要的路由信息也统一到这里呢？所以需要维护一份导航需要的层级路由配置，由这份配置来生成导航。

比如我们需要配置这样的导航
```
系统管理
  个人信息
  主题设置
```
我们像这样配置就可以了
```jsx
    <Route path="/" component={SimpleLayout} authority={authorities}>
      <Route
        path="/manage"
        authority={authorities}
        icon="setting"
        name="系统管理"
      >
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
    </Route>
```
其实`<Route path="/manage" authority={authorities} icon="setting" name="系统管理">` 这个路由配置只是
用来配置导航目录，并没有实际的路由作用

### 登录机制
登录是借助localStorage存储用户信息来实现的。当调用登录接口，拿到返回的用户信息以`user`键值存入localStorage,并存入redux中(为了提高频繁读取用户信息的性能)；

退出时删除localStorage中`user`键值和redux中的用户信息；

由于redux存储的用户信息在浏览器刷新后会被清空，所有设计了一个高阶组件在应用启动时，自动读取localStorage的用户信息到
redux中；高阶组件文件位置在`src/utils/hoc/init-user-data.js`,代码实现如下
```js
/**
 * init user info to redux
 * read user info from localStorage to redux
 */
export default class InitUserData extends React.PureComponent {
  constructor(props) {
    super(props);
    const userStr = localStorage.getItem(USER_STORE_KEY);
    const user = userStr ? JSON.parse(userStr) : {};
    props.store.dispatch({
      type: "user/setUser",
      payload: user
    });
  }

  render() {
    return this.props.children;
  }
}
```
最后在应用启动配置上就可以啦，见`root.js`
```js
export default function root() {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <InitUserData store={store}>
          <Router history={history}>
            <App />
          </Router>
        </InitUserData>
      </ErrorBoundary>
    </Provider>
  );
}
```

当系统使用中服务器端用户session过期，需要用户身份的接口将返回当前未登录状态，应用接受到状态后，执行退出操作（删除localStorage中`user`键值和redux中的用户信息）,然后返回到登录页面。代码实现如下
```js
/**
   * handle no login case.
   * pop up login dialog when any interface return no login status
   * except url with 'state' param, it's three part login process
   * @param {*} response
   */
  function handleNoLogin (response) {
    // judge app is logining status just now
    if (response[API_STATUS_KEY] === USER_STATUS_NO_LOGIN) {
      root.store.dispatch ({type: 'user/setUser', payload: {}});
      localStorage.removeItem ('user');
      history.replace ('/user/login');
    }
    return response;
  }
```

### model 的使用

在参考 dva model 的基础上实现，简化了之前项目中 reducers 的编写。我们以一个具体的 model 实现来讲解：

```js
import Model from "../Model";

export default Model.getInstance(
  class extends Model {
    namespace = "TicTacToe";

    state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      historySelectText: ""
    };

    actions = {
      async handleClickWithout(index) {
        return await new Promise((resolve, reject) => {
          setTimeout(() => {
            this.dispatch({
              type: "TicTacToe/handleClick",
              payload: index
            });
            resolve("complete");
          }, 1000);
        });
      }
    };

    reducers = {
      handleClick(state, { payload: index }) {
        const history = state.history.slice(0, state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[index]) {
          return state;
        }
        squares[index] = state.xIsNext ? "X" : "O";
        return {
          ...state,
          history: history.concat([
            {
              squares
            }
          ]),
          stepNumber: history.length,
          xIsNext: !state.xIsNext
        };
      }
    };
  }
);
```

代码第一行 import 的 Model 类是我们的基础类，所有 model 的实现都要继承自它，就像第三行代码的`class extends Model`。`Model.getInstance`是 Model 的一个静态方法，用来实例化你的 model 类。

继续看下类中的定义，namespace 定义命名空间，用以区分其他的 model。state 是 model 状态的定义。异步 action function 需要在 actions 中定义。reducers，顾名思义，是用来定义 redcuer 的，另外同步的 action function 会自动根据 reducer 生成。比如，handleClick 这个 recuder,相应会有一个 handleClick 名称的 action，该 action 在`Model.getInstance`实例化的对象中。

在页面组件中，使用 redux connect 函数连接 model 实例的 actions，就能实现在 view 中发送 action 到 store; 另外与页面相关 store 状态的注入，使用`namespace`定义的名称来获取,因为与页面相关状态数据被存储在 store state 对象的`namespace`空间上，例如：

```js
@connect(
  ({ TicTacToe }) => {
    return { ...TicTacToe };
  },
  {
    ...ticTacToeModel.actions
  }
)
```

### 接口请求 fetch 的封装

### 与 gee-ui 组件库集成开发

[gee-ui](https://github.com/geetemp/gee-ui)组件库是我们 geetemp 前端团队内部的组件库实现，目前建立在对 antd 的继承实现上。目标是
从各个项目中抽取出公共组件的实现，与设计人员合作，形成一套公共的组件规范，以期服务于各类 pc 端项目产品。

借助`yarn link`或`npm link`命令，脚手架与 gee-ui 可以轻松集成，同时开发。

##### 安装 gee-ui

从 github 拉取 gee-ui 并安装

```bash
git clone git@github.com:geetemp/gee-ui.git
yarn install
yarn dev
```

##### 集成 gee-ui

在 gee-ui 项目根目录下 link

```bash
cd gee-ui
yarn link
```

使用该脚手架的项目根目录下 link gee-ui,并启动项目进行开发

```bash
cd {项目根目录}
yarn link gee-ui
yarn start
```

##### 使用 gee-ui 组件

完成了集成 gee-ui，就可以在项目中使用 gee-ui 的组件了

```js
import { Button } from "gee-ui";
function demo() {
  return <Button />;
}
```

##### 定制 gee-ui 主题

[gee-ui](https://github.com/geetemp/gee-ui) 主题的定制方法与 antd 相同，在 src 目录下新建 theme.js 文件，并定制主题变量。

```js
//theme.js
module.exports = () => {
  return {
    "primary-color": "#1DA57A"
  };
};
```

### 文件/目录名规范
详情请访问[技术规范](https://github.com/geetemp/team/wiki/%E6%8A%80%E6%9C%AF%E8%A7%84%E8%8C%83)

### 组件书写规范

组件有两种写法，一种是函数(function)，另一种是类(class)。先看下函数的写法规范

#### function 组件编写

```js
// eslint-disable-next-line no-use-before-define
Square.propTypes = {
  onClick: func.isRequired,
  value: string
};

// eslint-disable-next-line no-use-before-define
Square.defaultProps = {
  value: ""
};

export default function Square({ onClick, value = "" }) {
  return (
    <React.Fragment>
      <button className="square" onClick={onClick}>
        {value}
      </button>
      <style jsx>
        {`
          .square {
            background: #fff;
            border: 1px solid #999;
            float: left;
            font-size: 24px;
            font-weight: bold;
            line-height: 34px;
            height: 34px;
            margin-right: -1px;
            margin-top: -2px;
            padding: 0;
            text-align: center;
            width: 34px;
          }

          .square:focus {
            outline: none;
          }
        `}
      </style>
    </React.Fragment>
  );
}
```

这里，我们在组件声明之前设置`propTypes`和`defaultProps`，以至于他们能直接可见。我们可以这样做，是因为 javascript 函数提升。

#### class 组件编写

class 组件是可以有状态和组件生命周期方法的。我们一步步来写一个 class 组件。

###### 初始化 state

```js
import React, { Component } from 'react'
export default class ProfileContainer extends Component {
  state = { expanded: false }
```

你也可以使用老办法在构造器函数中初始化 state,你可以去[这里](https://stackoverflow.com/questions/35662932/react-constructor-es6-vs-es7)了解更多。我们更喜欢这种简洁的方式。

###### propTypes 和 defaultProps

```js
import React, { Component } from 'react'
export default class ProfileContainer extends Component {
  state = { expanded: false }

  static propTypes = {
    model: object.isRequired,
    title: string
  }

  static defaultProps = {
    model: {
      id: 0
    },
    title: 'Your Name'
  }
```

propTypes 和 defaultProps 是静态属性，在组件代码中尽可能在顶部声明。他们应当被读此文件的其他开发者立即可见，因为他们作为文档提供服务。

###### 方法

```js
import React, { Component } from 'react'
export default class ProfileContainer extends Component {
  state = { expanded: false }

  static propTypes = {
    model: object.isRequired,
    title: string
  }

  static defaultProps = {
    model: {
      id: 0
    },
    title: 'Your Name'
  }
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.model.save()
  }

  handleNameChange = (e) => {
    this.props.model.changeName(e.target.value)
  }

  handleExpand = (e) => {
    e.preventDefault()
    this.setState({ expanded: !this.state.expanded })
  }
```

对于类组件，当你传递放到到子组件时，你必须确保当他们被调用时有正确的 this。这通常通过将`this.handleSubmit.bind(this)`传递给子组件实现。

我们认为以上方法清楚又简单，通过 es6 箭头函数自动维护正确的 this 上下文。

###### 闭包

避免传递一个闭包给子组件，就像:

```js
<input
  type="text"
  value={model.name}
  // onChange={(e) => { model.name = e.target.value }}
  // ^ Not this. Use the below:
  onChange={this.handleChange}
  placeholder="Your Name"
/>
```

原因是：每次父组件重新渲染时，一个新的函数会被创建并传入 input

如果 input 是一个 react 组件，这将自动触发 input 重新渲染，不管它的其他 props 是否有真正的改变。

`Reconciliation`在 React 是一个开销昂贵的部分。传入一个类方法更容易阅读、调试和更改。

### 技术栈
- react
- react-router
- redux
- fetch
