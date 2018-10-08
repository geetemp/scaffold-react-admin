## scaffold-react-ssr

react server side render 脚手架，抽象团队项目中的公共部件，沉淀技术方案实践，与技术规范。

- [Getting started](#Getting-started)
- [组件书写规范](#组件书写规范)
  - [function 组件编写](#function-组件编写)
  - [class 组件编写](#class-组件编写)
- [model 的使用](#model-的使用)
- [styled-jsx 样式书写](#styled-jsx-样式书写)
- [接口请求 fetch 的封装](#接口请求-fetch-的封装)
- [与 gee-ui 组件库集成开发](#与-gee-ui-组件库集成开发)
  - [安装 gee-ui](#安装-gee-ui)
  - [集成 gee-ui](#集成-gee-ui)
  - [定制 gee-ui 主题](#定制-gee-ui-主题)
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

### styled-jsx 样式书写

这次采用的是 nextjs 推荐的[styled-jsx](https://github.com/zeit/styled-jsx)样式方案，它属于 css in js 的一种实现，另外我们使 styled-jsx 集成了 sass。

现在来一块完成下样式的编写,假设我们需要写一个首页，先写首页组件：

```js
import React, { Component } from "react";
import styles from "./Index.scss";

class Index extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <style jsx>{styles}</style>
      </div>
    );
  }
}

export default Index;
```

`Index.scss`文件内容如下

```scss
/* @styled-jsx=scoped */

.App {
  text-align: center;
}

.App-logo {
  height: 80px;
}

.App-header {
  background-color: #222;
  height: 150px;
  padding: 20px;
  color: white;
}

.App-title {
  font-size: 1.5em;
  color: #fff;
}

.App-intro {
  font-size: large;
}
```

组件的样式你可以`import`他们来自 scss 文件，并使用一个`<style jsx>`标签渲染他们，就像以上代码中的`<style jsx>{styles}</style>`。如果你想要你的样式成为全局样式，记得添加 global 属性`<style jsx global>`。当然你也可以使用一次性全局选择器`:global()`,在样式文件中局部定义全局样式。详见:https://github.com/zeit/styled-jsx

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

### 技术栈

- react
- react-router
- redux
- styled-jsx
- fetch
