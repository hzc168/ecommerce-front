### React+TS

### 1. 技术栈

#### 1.1 客户端

- 脚本：TypeScript
- 前端框架：React
- 路由管理：react-router-dom
- 用户界面：antd
- 全局状态管理：redux
- 异步状态更新：redux-saga
- 路由状态同步：connected-react-router
- 网络请求：axios
- 调试工具：readux-devtools-extension

#### 1.2 服务端

- 脚本：Node.js
- 数据库：Mongodb
- 数据库可视化：Robo 3T

### 2. 搭建开发环境（服务端）

#### 2.1 安装mongodb数据库

开始：`net start mongodb`

停止：`net stop mongodb`



### 3. 搭建开发环境（客户端）

#### 3.1 创建项目并安装依赖

1. 使用create-react-app脚手架创建react项目

   `npx create-react-app ecommerce-front --template typescript`

2. 安装项目依赖

   `npm install antd axios moment redux react-redux react-router-dom redux-daga connected-react-router redux-devtools-extension @types/react-redux @types/react-router-dom`

3. antd CSS使用CDN，在html中引用

   `https://cdn.bootcdn.net/ajax/libs/ant/4.7.3/antd.min.css`

#### 3.2 配置服务器端API请求地址

在项目的根目录下新建`.env`文件，并在文件中添加以下内容：

```js
REACT_APP_PRODUCTION_API_URL=http://fullstack.net.cn/api
REACT_APP_DEVLOPMENT_API_URL=http://localhost/api
```

create-react-app脚手架内置了dotenv，允许我们在React项目中配置环境变量，但环境变量的名字必须以REACT_APP_开头。

REACT_APP_PRODUCTION_API_URL：生产环境的服务器端API地址

REACT_APP_DEVLOPMENT_API_URL：开发环境的服务器端API地址

在项目中可以通过processenv.REACT_APP_DEVLOPMENT_API_URL 方式进行访问，但是这样会有弊端，其一是代码过长写起来不方便，解决方案就是将API地址写入配置中，根据环境决定使用哪个API地址：

```JS
export let API: string

if(process.env.NODE_ENV === 'development') {
	API = process.env.REACT_APP_DEVELOPMENT_API_URL;
} else {
	API = process.env.REACT_APP_PRODUCTION_API_URL;
}
```

#### 3.3 安装chrome扩展插件

`React Developer Tools`：检查React组件层次结构，在页面上显示React组件

`Redux DevTools`：监测Store中状态的变化

使用：

```js
import { composeWithDevTools } from 'redux-devtools-extension'

export const store = create(
	rootReducer,
	composeWithDevTools(applyMiddleware(...middlewares))
)
```



### 4. 页面组件初始化

删除无用的文件后，创建组件：

新建`src/components/admin`用于存放管理员端文件

新建`src/components/core`用于存放组件

在core下新建三个组件，`Home.tsx`、`Layout.tsx`、`Shop.tsx`，并在src下新建路由组件`Routes.tsx`

新建组件快捷键：rafce

```tsx
// src/components/core/Home.tsx
import React from 'react'

const Home = () => {
    return (
        <div>
            Home
        </div>
    )
}

export default Home
```

```tsx
// src/components/core/Layout.tsx
import React, { FC } from 'react'

interface Props {
    children: React.ReactNode
}

const Layout: FC<Props> = ({children}) => {
    return (
        <div>
            Layout
            {children}
        </div>
    )
}

export default Layout
```

```tsx
// src/components/core/Shop.tsx
import React from 'react'
import Layout from './Layout'

const Shop = () => {
    return (
        <Layout>
            Shop
        </Layout>
    )
}

export default Shop
```

### 5. 路由初始化

```tsx
// src/Routes.tsx
import React from 'react'
import { HashRouter, Switch, Route } from 'react-router-dom'
import Home from './components/core/Home'
import Shop from './components/core/Shop'

const Routes = () => {
    return (
        <HashRouter>
            <Switch>
                <Route path="/" component={Home} exact />
                <Route path="/shop" component={Shop} />
            </Switch>
        </HashRouter>
    )
}

export default Routes
```

在`src/index.tsx`中引用路由

```tsx
import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './Routes';

ReactDOM.render(
    <Routes />,
  document.getElementById('root')
);
```

运行项目，显示正常

### 6. 全局store初始化

创建文件：`src/store/index.ts`、`src/store/reducers/index.ts`、`src/store/reducers/test.reducer.ts`

在test.reducer中导出一条测试数据：

```ts
export default function testReducer(state: number = 0):number {
    return state
}
```

使用`combineReducers`合并reducers

```ts
// src/store/reducers/index.ts
import { combineReducers } from 'redux'
import testReducer from './test.reducer'

const rootReducer = combineReducers({
    test: testReducer
})

export default rootReducer
```

创建store

```ts
// src/store/index.ts
import { createStore } from 'redux'
import rootReducer from "./reducers";

const store = createStore(rootReducer)

export default store
```

在`src/index.tsx`中使用

```tsx
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Routes from './Routes';
import store from './store';

ReactDOM.render(
  <Provider store={store}><Routes /></Provider>,
  document.getElementById('root')
);
```

测试：

```tsx
// src/components/core/Home.tsx
import React from 'react'
import Layout from './Layout'
import { useSelector } from 'react-redux'

const Home = () => {
    const state = useSelector(state => state)
    return (
        <Layout>
            Home
            {JSON.stringify(state)}
        </Layout>
    )
}

export default Home
```

### 7. 将路由状态同步到全局store中

查看npm：`connected-react-router`

在reducer中添加 connectRouter，并修改导出：

```ts
// src/store/reducers/index.ts
import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import testReducer from './test.reducer'
import { History } from 'history'

const createRootReducer = (history: History) => combineReducers({
    test: testReducer,
    router: connectRouter(history)
})

export default createRootReducer
```

在store中创建store

```tsx
// src/store/index.ts
import { createStore, applyMiddleware } from 'redux'
import { createHashHistory } from 'history'
import createRootReducer from './reducers'
import { routerMiddleware } from 'connected-react-router'

export const history = createHashHistory()

const store = createStore(
    createRootReducer(history),
    applyMiddleware(routerMiddleware(history))
)

export default store
```

在最外层包裹ConnectedRouter

```tsx
// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom';
import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux';
import Routes from './Routes';
import store from './store';
import { history } from './store'

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Routes />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);
```

测试：

```tsx
// src/components/core/Shop.tsx
import React from 'react'
import { useSelector } from 'react-redux'
import Layout from './Layout'

const Shop = () => {
    const state = useSelector(state => state)
    return (
        <Layout>
            Shop
            {JSON.stringify(state)}
        </Layout>
    )
}

export default Shop
```