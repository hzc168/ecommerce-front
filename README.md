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



### 8. 登录注册及首页

添加 Ant Design：`npm i antd -S`

#### 8.1 创建导航菜单

新建`Navigation.tsx`，引入antd的Menu，并自定义selectable。

```tsx
import { Menu } from 'antd'
import React from 'react'
import { AppState } from "../../store/reducers"
import { RouterState } from 'connected-react-router';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';


function useActive(currentPath: string, path: string): string {
    return currentPath === path ? "ant-menu-item-selected" : ""
}

const Navigation = () => {
    const router = useSelector<AppState, RouterState>(state => state.router)
    const pathname = router.location.pathname
    const isHome = useActive(pathname, '/')
    const isShop = useActive(pathname, '/shop')
    return (
        <Menu mode="horizontal" selectable={false}>
            <Menu.Item className={isHome} key="home">
                <Link to="/">首页</Link>
            </Menu.Item>
            <Menu.Item className={isShop} key="shop">
                <Link to="/shop">商城</Link>
            </Menu.Item>
        </Menu>
    )
}

export default Navigation
```

#### 8.2 创建页头

使用antd中的PageHeader，并加入相关样式

`Layout.tsx`组件中加入 antd 中的 `PageHeader`

```tsx
<PageHeader className="jumbotron" title={title} subTitle={subTitle} />
```

#### 8.3 构建注册和登录表单

创建组件`Signin.tsx`、`Signup.tsx`分别为登录和注册组件，分别在导航和路由中添加，并引入表单组件。

如登录组件：

```tsx
import React from 'react'
import Layout from './Layout'
import { Button, Form, Input } from 'antd'

const Signin = () => {
    return (
        <Layout title="登录页" subTitle="这里是登录页">
            <Form>
                <Form.Item name="email" label="邮箱">
                    <Input />
                </Form.Item>
                <Form.Item name="password" label="密码">
                    <Input.Password />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">登录</Button>
                </Form.Item>
            </Form>
        </Layout>
    )
}

export default Signin
```


#### 8.4 实现注册的Redux

新建sagas，添加注册相关的redux

#### 8.5 处理注册结果

1. 注册成功 清空列表
2. 注册成功 显示成功的提示信息
3. 注册失败 显示失败的提示信息
4. 离开页面之前 重置状态

获取注册结果 auth

使用 useEffect 监听 auth 结果

#### 8.6 重置注册状态

新建resetSignup的action以及reducer

使用useEffect，在离开页面之前重置状态

使用 composeWithDevTools 查看页面中的状态，可以在浏览器控制台的redux中看到注册是的store状态。

执行上述三步：action -> reducer -> saga -> 组件中使用

**action:**

```ts
// store/actions/auth.action.js
export const SIGNUP = "SIGNUP"
export const SIGNUP_SUCCESS = "SIGNUP_SUCCESS"
export const SIGNUP_FAIL = "SIGNUP_FAIL"
export const RESET_SIGNUP = "RESET_SIGNUP"

export interface SignupPayload {
    email: string,
    name: string,
    password: string
}

export interface SignupAction {
    type: typeof SIGNUP,
    payload: SignupPayload
}

export interface SignupSuccessAction {
    type: typeof SIGNUP_SUCCESS
}

export interface SignupFailAction {
    type: typeof SIGNUP_FAIL,
    message: string
}

export interface ResetSignupAction {
    type: typeof RESET_SIGNUP
}

export const signup = (payload: SignupPayload): SignupAction => ({
    type: SIGNUP,
    payload
})

export const signupSuccess = (): SignupSuccessAction => ({ type: SIGNUP_SUCCESS })

export const signupFail = (message: string): SignupFailAction => ({
    type: SIGNUP_FAIL,
    message
})

export const resetSignup = (): ResetSignupAction => ({
    type: RESET_SIGNUP
})

export type AuthUnionType = SignupAction | SignupSuccessAction | SignupFailAction | ResetSignupAction
```

**reducer:**

```ts
// store/reducers/auth.reducer.ts
import { AuthUnionType, RESET_SIGNUP, SIGNUP, SIGNUP_FAIL, SIGNUP_SUCCESS } from '../actions/auth.action'

export interface AuthState {
    signup: {
        loaded: boolean,
        success: boolean,
        message: string
    }
}

const initialState: AuthState = {
    signup: {
        loaded: false,
        success: false,
        message: ''
    }
}

export default function authReducer(state = initialState, action: AuthUnionType) {
    switch (action.type) {
        case SIGNUP:
            return {
                ...state,
                signup: {
                    loaded: false,
                    success: false,
                }
            }
        case SIGNUP_SUCCESS:
            return {
                ...state,
                signup: {
                    loaded: true,
                    success: true
                }
            }
        case SIGNUP_FAIL:
            return {
                ...state,
                signup: {
                    loaded: true,
                    success: false
                }
            }
        case RESET_SIGNUP:
            return {
                ...state,
                signup: {
                    loaded: false,
                    success: false,
                    message: ""
                }
            }
        default:
            return state
    }
}
```

`auth.reducer`添加至`reducers/index.ts`中

```ts
import { combineReducers } from 'redux'
import { connectRouter, RouterState } from 'connected-react-router'
import { History } from 'history'
import authReducer, { AuthState } from './auth.reducer';

export interface AppState {
    router: RouterState,
    auth: AuthState
}

const createRootReducer = (history: History) => combineReducers({
    auth: authReducer,
    router: connectRouter(history)
})

export default createRootReducer
```

**saga:**

```ts
// store/sagas/auth.saga.ts
import { takeEvery, put } from 'redux-saga/effects'
import axios from 'axios'
import { API } from '../../config'
import { SIGNUP, SignupAction, signupSuccess, signupFail } from '../actions/auth.action';

function* handleSignup(action: SignupAction) {
    try {
        console.log('提交注册数据', action.payload)
        yield axios.post(`${API}/sign`, action.payload)
        yield put(signupSuccess())
    } catch (e) {
        yield put(signupFail(e.response.data.error))
    }
}

export default function* authSaga() {
    yield takeEvery(SIGNUP, handleSignup)
}
```

在`sagas/index.ts`中绑定saga

```ts
import { all } from 'redux-saga/effects'
import authSaga from './auth.saga'

export default function* rootSaga() {
    yield all([authSaga()])
}
```

reducer和saga在`store/index.ts`中使用：

```tsx
import { createStore, applyMiddleware } from 'redux'
import createRootReducer from './reducers'
import { createHashHistory } from 'history'
import { routerMiddleware } from 'connected-react-router'
import createSagaMiddleware from 'redux-saga'
import rootSaga from './sagas'

export const history = createHashHistory()

const sagaMiddleWare = createSagaMiddleware()

const store = createStore(
    createRootReducer(history),
    applyMiddleware(routerMiddleware(history), sagaMiddleWare)
)

sagaMiddleWare.run(rootSaga)

export default store
```

#### 8.7 实现登录功能

1. 实现登录的action，定义登录的常量，以及action接口类型，定义登录 登录成功和登录失败的action creator。
2. reducer中，新增signin判断
3. 使用saga接收action，处理登录请求
4. saga中使用接口，登录成功之后，把登录信息存储在localStorage中
5. 在signin组件中使用登录

登录action：

```ts
// store/actions/auth.action.ts
// 登录相关
export const SIGNIN = "SIGNIN"
export const SIGNIN_SUCCESS = "SIGNIN_SUCCESS"
export const SIGNIN_FAIL = "SIGNIN_FAIL"

export interface SigninPayload {
    email: string
    password: string
}

export interface SigninAction {
    type: typeof SIGNIN
    payload: SigninPayload
}

export interface SigninSuccessAction {
    type: typeof SIGNIN_SUCCESS
}

export interface SigninFailAction {
    type: typeof SIGNIN_FAIL
    message: string
}

export const signin = (payload: SigninPayload): SigninAction => ({
    type: SIGNIN,
    payload
})

export const signinSuccess = (): SigninSuccessAction => ({
    type: SIGNIN_SUCCESS
})

export const signinFail = (message: string): SigninFailAction => ({
    type: SIGNIN_FAIL,
    message
})


export type AuthUnionType = SignupAction 
    | SignupSuccessAction 
    | SignupFailAction 
    | ResetSignupAction
    | SigninAction
    | SigninSuccessAction
    | SigninFailAction
```

登录相关的reducer


```ts
// reducers/auth.reducer.ts
export interface AuthState {
    signup: {
        loaded: boolean,
        success: boolean,
        message: string
    },
    signin: {
        loaded: boolean,
        success: boolean,
        message: string
    }
}

const initialState: AuthState = {
    signup: {
        loaded: false,
        success: false,
        message: ''
    },
    signin: {
        loaded: false,
        success: false,
        message: ''
    }
}

case SIGNIN:
    return {
        ...state,
        signin: {
            loaded: false,
            success: false
        }
    }
case SIGNIN_SUCCESS:
    return {
        ...state,
        signin: {
            loaded: true,
            success: true
        }
    }
case SIGNIN_FAIL:
    return {
        ...state,
        signin: {
            loaded: true,
            success: false
        }
    }
```

登录相关的saga：

```ts
// store/sagas/auth.saga.ts
function* handleSignin(action: SigninAction): any {
    try {
        console.log('提交登录数据', action.payload)
        let response = yield axios.post(`${API}/signin`, action.payload)
        localStorage.setItem('jwt', JSON.stringify(response.data))
        yield put(signinSuccess())
    } catch (e) {
        yield put(signinFail(e.response.data.message))
    }
}

export default function* authSaga() {
    // 注册
    yield takeEvery(SIGNUP, handleSignup)
    // 登录
    yield takeEvery(SIGNIN, handleSignin)
}
```

组件中使用，下面

#### 8.8 处理登录结果

1. 获取登录结果
2. 登录失败 显示错误信息
3. 登录成功 根据角色跳转到对应的管理页面
4. 处理导航链接 已登录 隐藏 【登录，注册】 显示 【dashboard】

修改前端注册和登录接口，注册：`/api/reset/sign`，登录：`/api/signin`

服务端同样如此

登录成功后，缓存登录成功的信息，新建`src/helper/auth.ts`文件用来判断是否登录成功：

```ts
export function isAuth() {
    const jwt = localStorage.getItem('jwt')
    if(jwt) return JSON.parse(jwt)
    return false
}
```

新建`src/store/models/auth.js`存放token类型：

```tsx
export interface User {
    _id: string,
    name: string,
    email: string,
    role: number
}

export interface Jwt {
    token: string,
    user: User
}
```



```tsx
// src/components/core/Signin.tsx
import React from 'react'
import Layout from './Layout'
import { Button, Form, Input, Result } from 'antd'
import { SigninPayload } from '../../store/actions/auth.action';
import { useDispatch, useSelector } from 'react-redux'
import { signin } from '../../store/actions/auth.action'
import { AppState } from '../../store/reducers';
import { AuthState } from '../../store/reducers/auth.reducer';
import { isAuth } from '../../helpers/auth'
import { Jwt } from '../../store/models/auth'
import { Redirect } from 'react-router';

const Signin = () => {
    // 获取dispatch
    const dispatch = useDispatch()

    // 登录 
    const onFinish = (value: SigninPayload) => {
        dispatch(signin(value))
    }

    // 1. 获取登录结果
    const auth = useSelector<AppState, AuthState>(state => state.auth)

    // 2. 登录失败 显示错误信息
    const showError = () => {
        if (auth.signin.loaded && !auth.signin.success) {
            return (
                <Result
                    status="warning"
                    title="登录失败"
                    subTitle={auth.signup.message}
                />
            )
        }
    }

    // 3. 登录成功 根据角色跳转到对应的管理页面
    const redirectToDashboard = () => {
        const auth = isAuth()
        if (auth) {
            const {
                user: { role }
            } = auth as Jwt

            if (role === 0) {
                // 注册用户
                return <Redirect to="/user/dashboard" />
            } else {
                // 管理员
                return <Redirect to="/admin/dashboard" />
            }
        }
    }


    const signinForm = () => (
        <Form onFinish={onFinish}>
            <Form.Item name="email" label="邮箱">
                <Input />
            </Form.Item>
            <Form.Item name="password" label="密码">
                <Input.Password />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">登录</Button>
            </Form.Item>
        </Form>
    )

    // 4. 处理导航链接 已登录 隐藏 【登录，注册】 显示 【dashboard】

    return (
        <Layout title="登录页" subTitle="这里是登录页">
            {showError()}
            {redirectToDashboard()}
            {signinForm()}
        </Layout>
    )
}

export default Signin
```

处理导航链接 已登录 隐藏 【登录，注册】

修改 `Navigation.tsx`组件：

```tsx
import { Menu } from 'antd'
import React from 'react'
import { AppState } from "../../store/reducers"
import { RouterState } from 'connected-react-router';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { isAuth } from '../../helpers/auth';
import { Jwt } from '../../store/models/auth'

function useActive(currentPath: string, path: string): string {
    return currentPath === path ? "ant-menu-item-selected" : ""
}

const Navigation = () => {
    const router = useSelector<AppState, RouterState>(state => state.router)
    const pathname = router.location.pathname
    const isHome = useActive(pathname, '/')
    const isShop = useActive(pathname, '/shop')
    const isSignin = useActive(pathname, '/signin')
    const isSignup = useActive(pathname, '/signup')
    const isDashboard = useActive(pathname, getDashboardUrl())

    function getDashboardUrl(): string {
        let url = '/user/dashboard'
        if (isAuth()) {
            const {
                user: { role }
            } = isAuth() as Jwt

            if (role === 1) {
                url = '/admin/dashboard'
            }
        }
        return url
    }

    return (
        <Menu mode="horizontal" selectable={false}>
            <Menu.Item className={isHome} key="home">
                <Link to="/">首页</Link>
            </Menu.Item>
            <Menu.Item className={isShop} key="shop">
                <Link to="/shop">商城</Link>
            </Menu.Item>
            {
                !isAuth() && (
                    <>
                        <Menu.Item className={isSignin} key="signin">
                            <Link to="/signin">登录页</Link>
                        </Menu.Item>
                        <Menu.Item className={isSignup} key="signup">
                            <Link to="/signup">注册页</Link>
                        </Menu.Item>
                    </>
                )
            }
            {
                isAuth() && (
                    <Menu.Item className={isDashboard} key="dashboard">
                        <Link to={getDashboardUrl()}>dashboard</Link>
                    </Menu.Item>
                )
            }
        </Menu>
    )
}

export default Navigation
```


#### 8.9 受保护的Dashboard组件

添加受保护组件：`src/components/PrivateRoute.tsx`

在Routes中使用受保护组件

在PrivateRoute组件中判断组件是否登录，登录了跳转到对应的组件，没有登录则跳转到登录页。

添加AdminPrivateRoute管理员组件，在管理员组件中额外添加管理员的角色判断。

在数据库中修改一条role为1，验证功能。

新建四个组件：`src/components/admin/Dashboard`、`src/components/admin/AdminDashboard`、`src/components/admin/PrivateRoute`、`src/components/admin/AdminPrivateRoute`

```tsx
// src/components/admin/PrivateRoute
import React, { FC } from 'react'
import { Route, RouteProps, Redirect } from 'react-router-dom'
import { isAuth } from '../../helpers/auth'

interface PrivateRouteProps extends RouteProps {
    component: React.ComponentType<any>
}

const PrivateRoute: FC<PrivateRouteProps> = ({
    component: Component,
    ...rest
}) => {
    return (
        <Route {...rest} render={props => {
            const auth = isAuth()
            // 如果登录了
            if (auth) {
                return <Component {...props} />
            } else {
                return <Redirect to="/signin" />
            }
        }} />
    )
}

export default PrivateRoute
```

AdminPrivateRoute相似，多加一个权限判断

```tsx
return (
    <Route {...rest} render={props => {
        const auth = isAuth()
        // 如果登录了
        if (auth) {
            const {
                user: {role}
            } = auth as Jwt
            if(role === 1) return <Component {...props} />
        } else {
            return <Redirect to="/signin" />
        }
    }} />
)
```

在路由组件中应用受保护路由：

```tsx
import React from 'react'
import { HashRouter, Switch, Route } from 'react-router-dom'
import Home from './components/core/Home';
import Shop from './components/core/Shop';
import Signin from './components/core/Signin';
import Signup from './components/core/Signup';
import Dashboard from './components/admin/Dashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import PrivateRoute from './components/admin/PrivateRoute';
import AdminPrivateRoute from './components/admin/AdminPrivateRoute'

const Routes = () => {
    return (
        <HashRouter>
            <Switch>
                <Route path="/" component={Home} exact></Route>
                <Route path="/shop" component={Shop}></Route>
                <Route path="/signin" component={Signin}></Route>
                <Route path="/signup" component={Signup}></Route>
                <PrivateRoute path="/user/dashboard" component={Dashboard} />
                <AdminPrivateRoute path="/admin/dashboard" component={AdminDashboard} />
            </Switch>
        </HashRouter>
    )
}

export default Routes
```


#### 8.10 管理员组件显示管理员信息及链接

使用Row、Col对页面进行左右布局，

左侧增加菜单项：添加分类、添加产品、订单列表

显示管理员链接以及管理员基本信息

创建添加分类组件，并在路由中配置路由，

```tsx
// src/components/admin/AdminDashboard
import React from 'react'
import Layout from '../core/Layout';
import { Row, Col, Descriptions, Typography, Menu } from 'antd'
import { isAuth } from '../../helpers/auth';
import { Jwt } from '../../store/models/auth';
import { Link } from 'react-router-dom'
import {
    ShoppingCartOutlined,
    UserOutlined,
    OrderedListOutlined
} from '@ant-design/icons'

const { Title } = Typography;

const AdminDashboard = () => {
    const {
        user: { name, email }
    } = isAuth() as Jwt

	// 左侧菜单
    const adminLinks = () => (
        <>
            <Title level={5}>管理员链接</Title>
            <Menu>
                <Menu.Item>
                    <ShoppingCartOutlined />
                    <Link to="/create/category">添加分类</Link>
                </Menu.Item>
                <Menu.Item>
                    <UserOutlined />
                    <Link to="/create/product">添加产品</Link>
                </Menu.Item>
                <Menu.Item>
                    <OrderedListOutlined />
                    <Link to="">订单列表</Link>
                </Menu.Item>
            </Menu>
        </>
    )

    // 右侧管理员信息
    const adminInfo = () => (
        <Descriptions title="管理员信息">
            <Descriptions.Item label="昵称">{name}</Descriptions.Item>
            <Descriptions.Item label="邮箱">{email}</Descriptions.Item>
            <Descriptions.Item label="角色">管理员</Descriptions.Item>
        </Descriptions>
    )

    return (
        <Layout title="AdminDashboard" subTitle="这里是 AdminDashboard">
            <Row>
                <Col span="4">
                    {adminLinks()}
                </Col>
                <Col span="20">
                    {adminInfo()}
                </Col>
            </Row>
        </Layout>
    )
}

export default AdminDashboard
```



### 9. 产品添加、搜索和筛选

#### 9.1 实现添加分类功能

新增添加分类组件：`AddCategory.tsx`并在路由中配置

当分类名称改变时，发送接口保存分类，并重置输入框

```tsx
import React, { useState, useEffect } from 'react'
import Layout from '../core/Layout'
import { Form, Input, Button, message } from 'antd'
import { Link } from 'react-router-dom'
import { isAuth } from '../../helpers/auth';
import { Jwt } from '../../store/models/auth';
import axios from 'axios'
import { API } from '../../config'

const AddCategory = () => {

    const [name, setName] = useState<string>("")

    const { token } = isAuth() as Jwt
    const [form] = Form.useForm()

    useEffect(() => {
        async function addCategory() {
            try {
                let response = await axios.post<{ name: string }>(
                    `${API}/reset/category`,
                    {
                        name: name
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )
                message.success(`[${response.data.name}] 分类添加成功`)
                form.resetFields();
            } catch (e) {
                message.error(e.response.data.message)
            }
        }
        name && addCategory()
    }, [name])

    const onFinish = (value: { name: string }) => {
        setName(value.name)
    }

    return (
        <Layout title="添加分类" subTitle="这里是添加分类">
            <Form form={form} onFinish={onFinish}>
                <Form.Item name="name" label="分类名称">
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        添加分类
                    </Button>
                </Form.Item>
            </Form>
            <Button><Link to="/admin/dashboard">返回Dashboard</Link></Button>
        </Layout>
    )
}

export default AddCategory
```

#### 9.2 实现添加商品组件

新建添加商品组件：`src/components/admin/AddProduct.tsx`

- 上传商品封面

- 商品名称、商品描述、商品价格、所属分类（下拉框）、商品数量、是否需要运输（下拉框）

1. 新建`store/models/category.ts`和`product.ts`，输出分类和产品所对应的信息

   ```ts
   // category.ts
   export interface Category {
       _id: string,
       name: string
   }
   ```

2. 获取分类列表

新建分类相关的action、reducer、saga

```ts
// store/category.action.ts
import { Category } from "../models/category";

export const GET_CATEGORY = "GET_CATEGORY"
export const GET_CATEGORY_SUCCESS = "GET_CATEGORY_SUCCESS"

export interface GetCategoryAction {
    type: typeof GET_CATEGORY
}

export interface GetCategorySuccessAction {
    type: typeof GET_CATEGORY_SUCCESS
    payload: Category[]
}

export const getCategory = (): GetCategoryAction => ({
    type: GET_CATEGORY
})

export const getCategorySuccess = (
    payload: Category[]
): GetCategorySuccessAction => ({
    type: GET_CATEGORY_SUCCESS,
    payload
})

export type CategoryUnionType = GetCategoryAction
    | GetCategorySuccessAction
```

```ts
// store/reducers/category.reducer.ts
import { CategoryUnionType, GET_CATEGORY, GET_CATEGORY_SUCCESS } from "../actions/category.action";
import { Category } from "../models/category";

export interface CategoryState {
    category: {
        loaded: boolean,
        success: boolean,
        result: Category[]
    }
}

const initialState: CategoryState = {
    category: {
        loaded: false,
        success: false,
        result: []
    }
}

export default function categoryReducer(
    state = initialState,
    action: CategoryUnionType
) {
    switch (action.type) {
        case GET_CATEGORY:
            return {
                ...state,
                category: {
                    loaded: false,
                    success: false,
                    result: []
                }
            }
        case GET_CATEGORY_SUCCESS:
            return {
                ...state,
                category: {
                    loaded: true,
                    success: true,
                    result: action.payload
                }
            }
        default:
            return state
    }
}
```

在`store/reducers/index.ts`中引入

之后，实现分类的saga

```ts
// store/sagas/category.saga.ts
import { takeEvery, put } from "redux-saga/effects"
import { GET_CATEGORY, getCategorySuccess } from "../actions/category.action";
import { isAuth } from "../../helpers/auth";
import { Jwt } from "../models/auth";
import { Category } from "../models/category";
import axios from "axios"
import { API } from '../../config'

function* handleGetCategory(): any {
    const { token } = isAuth() as Jwt
    let response = yield axios.get<Category[]>(`${API}/reset/categories`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    yield put(getCategorySuccess(response.data))
}

export default function* categorySaga() {
    // 获取分类列表
    yield takeEvery(GET_CATEGORY, handleGetCategory)
}
```

在`sagas/index.ts`中引入：

```ts
import { all } from "redux-saga/effects";
import authSaga from "./auth.saga";
import categorySaga from "./category.saga";

export default function* rootSaga() {
    yield all([authSaga(), categorySaga()])
}
```


在添加商品的组件中(`AddProduct.tsx`)获取分类列表：

```tsx
const dispatch = useDispatch()

const category = useSelector<AppState, CategoryState>(state => state.category)

useEffect(() => {
    dispatch(getCategory())
}, [])
```

获取到分类列表，并遍历到Select选择框中。

```tsx
<Select>
    <Select.Option value="">请选择分类</Select.Option>
    {
        category.category.result.map(item => (
            <Select.Option value={item._id} key={item._id}>{item.name}</Select.Option>
        ))
    }
</Select>
```

3. 阻止上传封面的默认行为

   ```tsx
   const [file, setFile] = useState<RcFile>()
   
   const props = {
       accept: "image/*",
       beforeUpload: function (file: RcFile) {
           setFile(file)
           return false
       }
   }
   
   <Upload {...props}>
       <Button><UploadOutlined />上传封面</Button>
   </Upload>
   ```

4. 提交表单

完整的 `AddProduct`组件

```tsx
import React, { useEffect, useState } from 'react'
import Layout from '../core/Layout';
import { useSelector, useDispatch } from 'react-redux'
import { Form, Upload, Button, Input, Select, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { AppState } from '../../store/reducers';
import { CategoryState } from '../../store/reducers/category.reducer';
import { getCategory } from '../../store/actions/category.action';
import { isAuth } from '../../helpers/auth'
import { Jwt } from '../../store/models/auth'
import { RcFile } from 'antd/lib/upload';
import axios from 'axios';
import { API } from '../../config'

const AddProduct = () => {
    const dispatch = useDispatch()
    const [file, setFile] = useState<RcFile>()

    const category = useSelector<AppState, CategoryState>(state => state.category)

    useEffect(() => {
        dispatch(getCategory())
    }, [])

    const { token } = isAuth() as Jwt

    const onFinish = (product: any) => {
        const formData = new FormData()

        for (let attr in product) {
            formData.set(attr, product[attr])
        }
        if (typeof file !== "undefined") {
            formData.set('photo', file)
        }

        axios.post(`${API}/reset/products`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(() => {
            message.success('商品添加成功')
        }, () => {
            message.error('商品添加失败')
        })
    }

    const addProductForm = () => {
        const props = {
            accept: "image/*",
            beforeUpload: function (file: RcFile) {
                setFile(file)
                return false
            }
        }

        return (
            <Form initialValues={{ category: "" }} onFinish={onFinish}>
                <Form.Item>
                    <Upload {...props}>
                        <Button><UploadOutlined />上传封面</Button>
                    </Upload>
                </Form.Item>
                <Form.Item name="name" label="商品名称">
                    <Input />
                </Form.Item>
                <Form.Item name="description" label="商品描述">
                    <Input />
                </Form.Item>
                <Form.Item name="price" label="商品价格">
                    <Input />
                </Form.Item>
                <Form.Item name="category" label="所属分类">
                    <Select>
                        <Select.Option value="">请选择分类</Select.Option>
                        {
                            category.category.result.map(item => (
                                <Select.Option value={item._id} key={item._id}>{item.name}</Select.Option>
                            ))
                        }
                    </Select>
                </Form.Item>
                <Form.Item name="quantity" label="商品数量">
                    <Input />
                </Form.Item>
                <Form.Item name="shipping" label="是否需要运输">
                    <Select>
                        <Select.Option value="1">是</Select.Option>
                        <Select.Option value="0">否</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">添加商品</Button>
                </Form.Item>
            </Form>
        )
    }

    return (
        <Layout title="添加商品" subTitle="请添加商品">
            {addProductForm()}
        </Layout>
    )
}

export default AddProduct
```

#### 9.3 Home组件布局

```tsx
import React from 'react'
import Layout from './Layout'
import { useSelector } from 'react-redux'
import { Typography, Row, Col } from 'antd'

const { Title } = Typography

const Home = () => {
    const state = useSelector(state => state)
    console.log(JSON.stringify(state))
    return (
        <Layout title="首页" subTitle="这里是首页">
            <Title level={5}>最新上架</Title>
            <Row gutter={[16, 16]}>
                <Col span="6">
                    相关单个产品
                </Col>
            </Row>
            <Title level={5}>最受欢迎</Title>
            <Row gutter={[16, 16]}>
                <Col span="6">
                    相关单个产品
                </Col>
            </Row>
        </Layout>
    )
}

export default Home
```

#### 9.4 新建单个产品

##### 单独请求封面图片

新建单个产品组件：`core/ProductItem.tsx`

在这个组件中我们要展示产品的详细信息，单独请求封面图片

```tsx
import React, { FC } from 'react'
import { Card, Button, Typography, Row, Col } from 'antd'
import { Product } from '../../store/models/product';
import { Link } from 'react-router-dom'
import { API } from '../../config'

const { Title, Paragraph } = Typography

interface Props {
    product: Product
    showViewProduct?: boolean
    showCartBtn?: boolean
}

const ProductItem: FC<Props> = ({ product }) => {
    return (
        <Card
            style={{ width: 300 }}
            cover={
                <Image src={`${API}/products/photo/${product._id}`} alt={product.name} />
            }
            actions={[
                <Button type="link">
                    <Link to={`/product/${product._id}`}>查看详情</Link>
                </Button>,
                <Button type="link">
                    加入购物车
                </Button>
            ]}
        >
            <Title level={5}>{product.name}</Title>
            <Paragraph ellipsis={{ rows: 2 }}>{product.description}</Paragraph>
            <Row>
                <Col span="12">销量：{product.sold}</Col>
                <Col span="12" style={{ textAlign: 'right' }}>价格：{product.price}</Col>
            </Row>
            <Row>
                <Col span="12">上架时间：{product.createdAt}</Col>
                <Col span="12" style={{ textAlign: 'right' }}>
                    所属分类：{product.category.name}
                </Col>
            </Row>
        </Card>
    )
}

export default ProductItem
```

#### 9.5 Home组件中获取产品数据

product.action -> product.reducer -> product.saga

同样，在action中我们需要知道product的数据及类型，故在`models/product.ts`中填写

```ts
import { Category } from "./category";

export interface Product {
    _id: string
    name: string
    price: number
    description: string
    category: Category
    quantity: number
    sold?: number
    photo: FormData
    shipping: boolean
    createdAt: string
}
```

新建product.action

```ts
import { Product } from '../models/product'

export const GET_PRODUCT = "GET_PRODUCT"
export const GET_PRODUCT_SUCCESS = "GET_PRODUCT_SUCCESS"
export const GET_PRODUCT_FAIL = "GET_PRODUCT_FAIL"

export interface GetProductAction {
    type: typeof GET_PRODUCT,
    sortBy: string,
    order: string,
    limit: number
}

export interface GetProductSuccessAction {
    type: typeof GET_PRODUCT_SUCCESS,
    payload: Product[],
    sortBy: string
}

export const getProduct = (
    sortBy: string,
    order: string = "desc",
    limit: number = 5
): GetProductAction => ({
    type: GET_PRODUCT,
    sortBy,
    order,
    limit
})

export const getProductSuccess = (
    payload: Product[],
    sortBy: string
): GetProductSuccessAction => ({
    type: GET_PRODUCT_SUCCESS,
    payload,
    sortBy
})

export type ProductUnionType = GetProductAction 
    | GetProductSuccessAction
```

新建product的reducer，，此时，我们需要两种类型的product，最新上架（createAt），最受欢迎（sold）

```ts
// store/reducers/product.reducer.ts
import { Product } from '../models/product'
import { ProductUnionType, GET_PRODUCT, GET_PRODUCT_SUCCESS } from '../actions/product.action';

export interface ProductState {
    createdAt: {
        loaded: boolean,
        success: boolean,
        products: Product[]
    }
    sold: {
        loaded: boolean,
        success: boolean,
        products: Product[]
    }
}

const initialState: ProductState = {
    createdAt: {
        loaded: false,
        success: false,
        products: []
    },
    sold: {
        loaded: false,
        success: false,
        products: []
    }
}


export default function productReducer(state = initialState, action: ProductUnionType) {
    switch (action.type) {
        case GET_PRODUCT:
            return {
                ...state,
                [action.sortBy]: {
                    ...state[action.sortBy === "createAt" ? "createdAt" : "sold"],
                    loaded: false,
                    success: false
                }
            }
        case GET_PRODUCT_SUCCESS:
            return {
                ...state,
                [action.sortBy]: {
                    loaded: true,
                    success: true,
                    products: action.payload
                }
            }
        default:
            return state;
    }
}
```

在`reducers/index.ts`中引入：

```ts
import { combineReducers } from 'redux'
import { connectRouter, RouterState } from 'connected-react-router'
import { History } from 'history'
import authReducer, { AuthState } from './auth.reducer';
import categoryReducer, { CategoryState } from './category.reducer';
import productReducer, { ProductState } from './product.reducer';

export interface AppState {
    router: RouterState,
    auth: AuthState,
    category: CategoryState,
    product: ProductState
}

const createRootReducer = (history: History) => combineReducers({
    auth: authReducer,
    category: categoryReducer,
    product: productReducer,
    router: connectRouter(history)
})

export default createRootReducer
```

新建saga，在saga中，我们需要接收获取产品的action：GET_PRODUCT，并处理它，即获取数据放入store中

```ts
// sagas/product.saga.ts
import { takeEvery, put } from 'redux-saga/effects'
import axios from 'axios'
import { API } from "../../config";
import { isAuth } from "../../helpers/auth";
import { Jwt } from "../models/auth";
import { GET_PRODUCT, GetProductAction, getProductSuccess } from "../actions/product.action";

function* handleGetProduct({ sortBy, order, limit }: GetProductAction): any {
    const { token } = isAuth() as Jwt
    let response = yield axios.get(`${API}/products`, {
        params: { sortBy, order, limit },
        headers: {
            Authorization: `Bearer ${token}`
        }
    },

    )
    yield put(getProductSuccess(response.data, sortBy))
}

export default function* productSaga() {
    yield takeEvery(GET_PRODUCT, handleGetProduct)
}
```

在`sagas/index.ts`中引入：

```ts
import { all } from "redux-saga/effects";
import authSaga from "./auth.saga";
import categorySaga from "./category.saga";
import productSaga from "./product.saga";

export default function* rootSaga() {
    yield all([authSaga(), categorySaga(), productSaga()])
}
```

在Home组件中获取，

```tsx
import React, { useEffect } from 'react'
import Layout from './Layout'
import { useSelector, useDispatch } from 'react-redux'
import { Typography, Row, Col } from 'antd'
import { AppState } from '../../store/reducers'
import { ProductState } from '../../store/reducers/product.reducer'
import { getProduct } from '../../store/actions/product.action'
import ProductItem from './ProductItem'

const { Title } = Typography

const Home = () => {
    const dispatch = useDispatch()

    const { createdAt, sold } = useSelector<AppState, ProductState>(state => state.product)

    useEffect(() => {
        dispatch(getProduct("createdAt"))
        dispatch(getProduct("sold"))
    }, [])

    return (
        <Layout title="首页" subTitle="这里是首页">
            <Title level={5}>最新上架</Title>
            <Row gutter={[16, 16]}>
                {
                    createdAt.products.map(item => (
                        <Col span="6" key={item._id}>
                            <ProductItem product={item} />
                        </Col>
                    ))
                }
            </Row>
            <Title level={5}>最受欢迎</Title>
            <Row gutter={[16, 16]}>
                {
                    sold.products.map(item => (
                        <Col span="6" key={item._id}>
                            <ProductItem product={item} />
                        </Col>
                    ))
                }
            </Row>
        </Layout>
    )
}

export default Home
```

#### 9.6 搜索功能

新建Search组件`core/Search.tsx`

在搜索组件中，我们通过分类搜索来获取产品，所以我们需要获取所有分类

我们直接使用useEffect、useSelector等获取分类列表：

```ts
const dispatch = useDispatch()

const { category } = useSelector<AppState, CategoryState>(state => state.category)

useEffect(() => {
    dispatch(getCategory())
}, [])
```

之后，我们需要获取搜索结果

`store/actions/product.actions.ts`中补充搜索相关action

```ts
/**
 * 搜索商品
 */
export const SEARCH_PRODUCT = "SEARCH_PRODUCT"
export const SEARCH_PRODUCT_SUCCESS = "SEARCH_PRODUCT_SUCCESS"

export interface SearchProductAction {
    type: typeof SEARCH_PRODUCT
    payload: {
        category: string,
        search: string
    }
}

export interface SearchProductSuccessAction {
    type: typeof SEARCH_PRODUCT_SUCCESS
    products: Product[]
}

export const searchProduct = (payload: {
    category: string,
    search: string
}): SearchProductAction => ({
    type: SEARCH_PRODUCT,
    payload
})

export const searchProductSuccess = (
    products: Product[]
): SearchProductSuccessAction => ({
    type: SEARCH_PRODUCT_SUCCESS,
    products
})
```

补充搜索相关reducer和saga

最后在搜索界面中调用：

```tsx
// core/Search.tsx
import React, { useEffect } from 'react'
import { Form, Select, Input, Button, Divider, Row, Col, } from 'antd'
import ProductItem from './ProductItem'
import { useDispatch, useSelector } from 'react-redux'
import { getCategory } from '../../store/actions/category.action'
import { AppState } from '../../store/reducers'
import { CategoryState } from '../../store/reducers/category.reducer'
import { searchProduct } from '../../store/actions/product.action'
import { ProductState } from '../../store/reducers/product.reducer'

const Search = () => {
    const dispatch = useDispatch()

    const { category } = useSelector<AppState, CategoryState>(state => state.category)

    useEffect(() => {
        dispatch(getCategory())
    }, [])

    const { search } = useSelector<AppState, ProductState>(state => state.product)

    const onFinish = (value: { category: string; search: string }) => {
        dispatch(searchProduct({ category: value.category, search: value.search }))
    }

    return (
        <>
            <Form onFinish={onFinish} layout="inline" initialValues={{ category: 'All' }}>
                <Input.Group compact>
                    <Form.Item name="category">
                        <Select>
                            <Select.Option value="All">所有分类</Select.Option>
                            {category.result.map(item => (
                                <Select.Option value={item._id} key={item._id}>{item.name}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="search">
                        <Input placeholder="请输入搜索关键字" />
                    </Form.Item>
                    <Form.Item>
                        <Button htmlType="submit">搜索</Button>
                    </Form.Item>
                </Input.Group>
            </Form>
            <Divider />
            <Row gutter={[16, 16]}>
                {
                    search.map(item => (
                        <Col span="6">
                            <ProductItem product={item} />
                        </Col>
                    ))
                }
            </Row>
        </>
    )
}

export default Search
```

#### 9.7 商城页面布局

```tsx
// core/Shop.tsx
import React from 'react'
import Layout from './Layout';
import { Row, Col } from 'antd'

const Shop = () => {
    return (
        <Layout title="商城" subTitle="这里是商城">
            <Row>
                <Col span="4">
                    筛选条件
                </Col>
                <Col span="20">
                    筛选结果，产品列表
                </Col>
            </Row>
        </Layout>
    )
}

export default Shop
```

在这里的我们的筛选条件有，按分类、价格筛选

分别新建分类、价格的筛选组件：`core/Checkbox.tsx`、`core/RadioBox.tsx`

##### 1. Checkbox组件

```tsx
import React, { FC, useEffect } from 'react'
import { Typography, Checkbox as AntdCheckbox } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from '../../store/reducers';
import { CategoryState } from '../../store/reducers/category.reducer';
import { getCategory } from '../../store/actions/category.action'
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
const { Title } = Typography

interface Props {
    handleFilter: (arg: string[]) => void
}

// 父组件传递handleFilter函数，用于保存筛选条件
const Checkbox: FC<Props> = ({ handleFilter }) => {
    const dispatch = useDispatch()

    const category = useSelector<AppState, CategoryState>(state => state.category)

    useEffect(() => {
        dispatch(getCategory())
    }, [])

    const onChange = (checkedValue: CheckboxValueType[]): any => {
        handleFilter(checkedValue as string[])
    }

    return (
        <>
            <Title level={4}>按照分类筛选</Title>
            <AntdCheckbox.Group
                className="checkBoxFilter"
                options={category.category.result.map(item => ({
                    label: item.name,
                    value: item._id
                }))}
                onChange={onChange}
            />
        </>
    )
}

export default Checkbox
```

##### 2. RadioBox组件

```tsx
import React, {FC} from 'react'
import { Typography, List, Radio } from 'antd'
import prices from '../../helpers/price'
import { RadioChangeEvent } from 'antd/lib/radio'

const { Title } = Typography

interface Props {
    handleFilter: (arg: number[]) => void
}

const RadioBox:FC<Props> = ({handleFilter}) => {

    const onChange = (event: RadioChangeEvent) => {
        handleFilter(event.target.value)
    }

    return (
        <>
            <Title level={4}>按照价格筛选</Title>
            <Radio.Group>
                <List
                    dataSource={prices}
                    renderItem={item => (
                        <List.Item>
                            <Radio onChange={onChange} value={item.array}>{item.name}</Radio>
                        </List.Item>
                    )}
                />
            </Radio.Group>
        </>
    )
}

export default RadioBox
```

相关的price列表：

```ts
// src/helpers/price.ts
import { Price } from '../store/models/product'

const prices: Price[] = [
    {
        id: 0,
        name: "不限制价格",
        array: []
    },
    {
        id: 2,
        name: "1 - 50",
        array: [1 - 50]
    },
    {
        id: 3,
        name: "51 - 100",
        array: [51 - 100]
    }
]

export default prices
```

##### 3.  Checkbox和RadioBox在Shop组件中的应用

```tsx
import React, { useState } from 'react'
import Layout from './Layout';
import { Row, Col, Space } from 'antd'
import Checkbox from './Checkbox';
import RadioBox from './RadioBox';


const Shop = () => {
    const [myFilters, setMyFilters] = useState<{ category: string[], price: number[] }>({ category: [], price: [] })

    const filterDOM = () => (
        <Space size="middle" direction="vertical">
            <Checkbox handleFilter={(filters: string[]) => {
                setMyFilters({ ...myFilters, category: filters })
            }} />
            <RadioBox handleFilter={(filters: number[]) => {
                setMyFilters({ ...myFilters, price: filters })
            }} />
        </Space>
    )

    return (
        <Layout title="商城" subTitle="这里是商城">
            <Row>
                <Col span="4">
                    {filterDOM()}
                </Col>
                <Col span="20">
                    筛选结果，产品列表
                </Col>
            </Row>
        </Layout>
    )
}

export default Shop
```

此时当筛选条件 myFilters 改变时需要获取产品列表

##### 4. 获取筛选的产品列表

使用useEffect调用

```tsx
useEffect(() => {
    dispatch(filterProduct({ filters: myFilters }))
}, [myFilters])
```

此时我们需要补充product.action

```ts
/**
 * 和筛选相关的action
 */

export const FILTER_PRODUCT = "FILTER_PRODUCT"
export const FILTER_PRODUCT_SUCCESS = "FILTER_PRODUCT_SUCCESS"

export interface FilterPayload {
    order?: string,
    sortBy?: string,
    limit?: number,
    skip: number,
    filters?: {
        category: string[]
        price: number[]
    }
}
export interface FilterProductAction {
    type: typeof FILTER_PRODUCT
    payload: FilterPayload
}

export interface FilterProductSuccessAction {
    type: typeof FILTER_PRODUCT_SUCCESS,
    payload: {
        size: number,
        data: Product[]
    },
    skip: number
}

export const filterProduct = (payload: FilterPayload): FilterProductAction => ({
    type: FILTER_PRODUCT,
    payload
})

export const filterProductSuccess = (
    payload: {
        size: number
        data: Product[]
    },
    skip: number
): FilterProductSuccessAction => ({
    type: FILTER_PRODUCT_SUCCESS,
    payload,
    skip
})
```

同样补充product.reducer和saga

最后在Shop组件中使用，并补充skip参数，跳过前多少个产品，该属性配合`加载更多`按钮使用

完整的Shop组件

```tsx
// src/core/Shop.tsx
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Layout from './Layout';
import { Row, Col, Space, Button, Empty } from 'antd'
import Checkbox from './Checkbox';
import RadioBox from './RadioBox';
import { filterProduct } from '../../store/actions/product.action'
import { AppState } from '../../store/reducers'
import { ProductState } from '../../store/reducers/product.reducer'
import ProductItem from './ProductItem'

const Shop = () => {
    const dispatch = useDispatch()

    const [skip, setSkip] = useState<number>(0)

    const [myFilters, setMyFilters] = useState<{ category: string[], price: number[] }>({ category: [], price: [] })

    const product = useSelector<AppState, ProductState>(state => state.product)

    // 注意使用书顺序
    useEffect(() => {
        setSkip(0)
    }, [myFilters])

    useEffect(() => {
        dispatch(filterProduct({ filters: myFilters, skip }))
    }, [myFilters, skip])


    const filterDOM = () => (
        <Space size="middle" direction="vertical">
            <Checkbox handleFilter={(filters: string[]) => {
                setMyFilters({ ...myFilters, category: filters })
            }} />
            <RadioBox handleFilter={(filters: number[]) => {
                setMyFilters({ ...myFilters, price: filters })
            }} />
        </Space>
    )

    const productDOM = () => (
        <Row gutter={[16, 16]}>
            {product.filter.result.data.map(item => (
                <Col key={item._id} span="6">
                    <ProductItem product={item} />
                </Col>
            ))}
        </Row>
    )


    const loadMoreButton = () => {
        return (
            <Row>
                {product.filter.result.size >= 4 && (<Button onClick={loadMore}>加载更多</Button>)}
            </Row>
        )
    }

    const loadMore = () => {
        setSkip(skip + 4)
    }

    const noData = () => {
        return <>
            <Row>{product.filter.result.size === 0 && <Empty />}</Row>
        </>
    }

    return (
        <Layout title="商城" subTitle="这里是商城">
            <Row>
                <Col span="4">
                    {filterDOM()}
                </Col>
                <Col span="20">
                    {productDOM()}
                    {loadMoreButton()}
                    {noData()}
                </Col>
            </Row>
        </Layout>
    )
}

export default Shop
```

#### 9.8 实现商品详情功能

新建`core/Product.tsx`作为商品详情组件

使用`useParams`获取传递过来的productId，派发action获取商品详情

```tsx
import React, { useEffect } from 'react'
import Layout from './Layout'
import { Row, Col } from 'antd'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getProductById } from '../../store/actions/product.action'
import { AppState } from '../../store/reducers'
import { ProductState } from '../../store/reducers/product.reducer'
import ProductItem from './ProductItem'

const Product = () => {
    const dispatch = useDispatch()

    const { product } = useSelector<AppState, ProductState>(state => state.product)

    const { productId } = useParams<{ productId: string }>()
    console.log(productId)
    useEffect(() => {
        dispatch(getProductById({ productId }))
    }, [])

    return (
        <Layout title="商品名称" subTitle="商品详情">
            <Row gutter={36}>
                <Col span="18">
                    <ProductItem showViewProduct={false} product={product.result} />
                </Col>
                <Col span="6">right</Col>
            </Row>
        </Layout>
    )
}

export default Product
```

补充商品详情的action

商品完整的action

```ts
// product.action.ts
import { Product } from "../models/product"

export const GET_PRODUCT = "GET_PRODUCT"
export const GET_PRODUCT_SUCCESS = "GET_PRODUCT_SUCCESS"
export const GET_PRODUCT_FAIL = "GET_PRODUCT_FAIL"

export interface GetProductAction {
    type: typeof GET_PRODUCT,
    sortBy: string,
    order: string,
    limit: number
}

export interface GetProductSuccessAction {
    type: typeof GET_PRODUCT_SUCCESS,
    payload: Product[],
    sortBy: string
}

export const getProduct = (
    sortBy: string,
    order: string = "desc",
    limit: number = 5
): GetProductAction => ({
    type: GET_PRODUCT,
    sortBy,
    order,
    limit
})

export const getProductSuccess = (
    payload: Product[],
    sortBy: string
): GetProductSuccessAction => ({
    type: GET_PRODUCT_SUCCESS,
    payload,
    sortBy
})


/**
 * 搜索商品
 */
export const SEARCH_PRODUCT = "SEARCH_PRODUCT"
export const SEARCH_PRODUCT_SUCCESS = "SEARCH_PRODUCT_SUCCESS"

export interface SearchProductAction {
    type: typeof SEARCH_PRODUCT
    payload: {
        category: string,
        search: string
    }
}

export interface SearchProductSuccessAction {
    type: typeof SEARCH_PRODUCT_SUCCESS
    products: Product[]
}

export const searchProduct = (payload: {
    category: string,
    search: string
}): SearchProductAction => ({
    type: SEARCH_PRODUCT,
    payload
})

export const searchProductSuccess = (
    products: Product[]
): SearchProductSuccessAction => ({
    type: SEARCH_PRODUCT_SUCCESS,
    products
})

/**
 * 和筛选相关的action
 */

export const FILTER_PRODUCT = "FILTER_PRODUCT"
export const FILTER_PRODUCT_SUCCESS = "FILTER_PRODUCT_SUCCESS"


export interface FilterPayload {
    order?: string,
    sortBy?: string,
    limit?: number,
    skip: number,
    filters?: {
        category: string[]
        price: number[]
    }
}
export interface FilterProductAction {
    type: typeof FILTER_PRODUCT
    payload: FilterPayload
}

export interface FilterProductSuccessAction {
    type: typeof FILTER_PRODUCT_SUCCESS,
    payload: {
        size: number,
        data: Product[]
    },
    skip: number
}

export const filterProduct = (payload: FilterPayload): FilterProductAction => ({
    type: FILTER_PRODUCT,
    payload
})

export const filterProductSuccess = (
    payload: {
        size: number
        data: Product[]
    },
    skip: number
): FilterProductSuccessAction => ({
    type: FILTER_PRODUCT_SUCCESS,
    payload,
    skip
})

// 通过产品 id 获取产品详情
export const GET_PRODUCT_BY_ID = "GET_PRODUCT_BY_ID"
export const GET_PRODUCT_BY_ID_SUCCESS = "GET_PRODUCT_BY_ID_SUCCESS"

export interface GetProductByIdAction {
    type: typeof GET_PRODUCT_BY_ID
    payload: {
        productId: string
    }
}

export interface GetProductByIdSuccessAction {
    type: typeof GET_PRODUCT_BY_ID_SUCCESS
    payload: Product
}

export const getProductById = (payload: {
    productId: string
}): GetProductByIdAction => ({
    type: GET_PRODUCT_BY_ID,
    payload
})

export const getProductByIdSuccess = (payload: Product): GetProductByIdSuccessAction => ({
    type: GET_PRODUCT_BY_ID_SUCCESS,
    payload
})

export type ProductUnionType = GetProductAction
    | GetProductSuccessAction
    | SearchProductAction
    | SearchProductSuccessAction
    | FilterProductAction
    | FilterProductSuccessAction
    | GetProductByIdAction
    | GetProductByIdSuccessAction
```

商品完整的reducer：

```ts
import { FILTER_PRODUCT, FILTER_PRODUCT_SUCCESS, GET_PRODUCT, GET_PRODUCT_BY_ID, GET_PRODUCT_BY_ID_SUCCESS, GET_PRODUCT_SUCCESS, ProductUnionType, SEARCH_PRODUCT_SUCCESS } from "../actions/product.action";
import { Product } from "../models/product";

export interface ProductState {
    createdAt: {
        loaded: boolean,
        success: boolean,
        products: Product[]
    }
    sold: {
        loaded: boolean,
        success: boolean,
        products: Product[]
    },
    search: Product[],
    filter: {
        loaded: boolean
        success: boolean
        result: {
            size: number
            data: Product[]
        }
    },
    product: {
        loaded: boolean
        success: boolean
        result: Product
    }
}

const initialState: ProductState = {
    createdAt: {
        loaded: false,
        success: false,
        products: []
    },
    sold: {
        loaded: false,
        success: false,
        products: []
    },
    search: [],
    filter: {
        loaded: false,
        success: false,
        result: {
            size: 0,
            data: []
        }
    },
    product: {
        loaded: false,
        success: false,
        result: {
            _id: "",
            name: "",
            price: 0,
            description: "",
            category: {
                _id: "",
                name: ""
            },
            quantity: 0,
            sold: 0,
            photo: new FormData(),
            shipping: false,
            createdAt: ""
        }
    }
}

export default function productReducer(state = initialState, action: ProductUnionType) {
    switch (action.type) {
        case GET_PRODUCT:
            return {
                ...state,
                [action.sortBy]: {
                    ...state[action.sortBy === "createAt" ? "createdAt" : "sold"],
                    loaded: false,
                    success: false
                }
            }
        case GET_PRODUCT_SUCCESS:
            return {
                ...state,
                [action.sortBy]: {
                    loaded: true,
                    success: true,
                    products: action.payload
                }
            }
        case SEARCH_PRODUCT_SUCCESS:
            return {
                ...state,
                search: action.products
            }
        case FILTER_PRODUCT:
            return {
                ...state,
                filter: {
                    loaded: false,
                    success: false,
                    result: {
                        size: 0,
                        data: state.filter.result.data
                    }
                }
            }
        case FILTER_PRODUCT_SUCCESS:
            let data = action.skip === 0 ? action.payload.data : [...state.filter.result.data, ...action.payload.data]
            return {
                ...state,
                filter: {
                    loaded: true,
                    success: true,
                    result: {
                        size: action.payload.size,
                        data
                    }
                }
            }
        case GET_PRODUCT_BY_ID:
            return {
                ...state,
                product: {
                    ...state.product,
                    loaded: false,
                    success: false
                }
            }
        case GET_PRODUCT_BY_ID_SUCCESS:
            return {
                ...state,
                product: {
                    loaded: false,
                    success: false,
                    result: action.payload
                }
            }
        default:
            return state;
    }
}
```

商品完整saga

```ts
// store/sagas/product.saga.ts
import { takeEvery, put } from 'redux-saga/effects'
import axios from 'axios'
import { API } from "../../config";
import { isAuth } from "../../helpers/auth";
import { Jwt } from "../models/auth";
import { FilterProductAction, filterProductSuccess, FILTER_PRODUCT, GetProductAction, GetProductByIdAction, getProductByIdSuccess, getProductSuccess, GET_PRODUCT, GET_PRODUCT_BY_ID, SearchProductAction, searchProductSuccess, SEARCH_PRODUCT } from "../actions/product.action";

function* handleGetProduct({ sortBy, order, limit }: GetProductAction): any {
    const { token } = isAuth() as Jwt
    let response = yield axios.get(`${API}/products`, {
        params: { sortBy, order, limit },
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    yield put(getProductSuccess(response.data, sortBy))
}

function* handleSearchProduct({ payload: { search, category } }: SearchProductAction): any {
    let response = yield axios.get(`${API}/products/search`, {
        params: { search, category }
    })
    yield put(searchProductSuccess(response.data))
}

function* handleFilterProduct(action: FilterProductAction): any {
    let response = yield axios.post(`${API}/products/filter`, action.payload)
    yield put(filterProductSuccess(response.data, action.payload.skip))
}

function* handleGetProductById({ payload }: GetProductByIdAction): any {
    const { token } = isAuth() as Jwt
    let response = yield axios.get(`${API}/reset/products/${payload.productId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    yield put(getProductByIdSuccess(response.data))
}

export default function* productSaga() {
    yield takeEvery(GET_PRODUCT, handleGetProduct)
    yield takeEvery(SEARCH_PRODUCT, handleSearchProduct)
    yield takeEvery(FILTER_PRODUCT, handleFilterProduct)
    yield takeEvery(GET_PRODUCT_BY_ID, handleGetProductById)
}
```



### 10. 购物车相关

#### 10.1 将商品添加到购物车

在商品列表中，每个商品都有查看详情、加入购物车两个按钮，实现加入购物车

调用`connected-react-router`包中的 push 方法进行路由跳转

我们把加入购物车的数据放在localStorage中

```tsx
// core/ProductItem.tsx
import React from 'react'
import { Card, Button, Typography, Row, Col, Image } from 'antd'
import { Link } from 'react-router-dom'
import { FC } from 'react'
import { Product } from '../../store/models/product'
import { API } from '../../config'
import moment from 'moment'
import { addItem } from '../../helpers/cart'
import {useDispatch} from 'react-redux'
import { push } from 'connected-react-router'

const { Title, Paragraph } = Typography

interface Props {
    product: Product
    showViewProduct?: boolean
    showCartBtn?: boolean
}

const ProductItem: FC<Props> = ({ product, showViewProduct = true, showCartBtn = true }) => {

    const dispatch = useDispatch()

    const addToCart = () => {
        addItem(product, () => {
            dispatch(push('/cart'))
        })
    }

    const showButtons = () => {
        let buttonArray = []
        if (showViewProduct) {
            buttonArray.push(
                <Button type="link">
                    <Link to={`/product/${product._id}`}>查看详情</Link>
                </Button>
            )
        }
        if (showCartBtn) {
            buttonArray.push(
                <Button type="link" onClick={addToCart}>
                    加入购物车
                </Button>
            )
        }
        return buttonArray
    }

    return (
        <Card
            style={{ width: 300 }}
            cover={
                <Image src={`${API}/products/photo/${product._id}`} alt={product.name} />
            }
            actions={showButtons()}
        >
            <Title level={5}>{product.name}</Title>
            <Paragraph ellipsis={{ rows: 2 }}>{product.description}</Paragraph>
            <Row>
                <Col span="12">销量：{product.sold}</Col>
                <Col span="12" style={{ textAlign: 'right' }}>价格：{product.price}</Col>
            </Row>
            <Row>
                <Col span="12">上架时间：{moment(product.createdAt).format('YYYY-MM-DD')}</Col>
                <Col span="12" style={{ textAlign: 'right' }}>
                    所属分类：{product.category.name}
                </Col>
            </Row>
        </Card>
    )
}

export default ProductItem
```

这里的addItem方法实现具体的把商品加入购物车

```ts
// src/helpers/cart.ts
/**
 * 将商品添加到购物车
 */

import { Product } from "../store/models/product";

export interface CartItem extends Product {
    count: number
}

export const addItem = (item: Product, next: () => void) => {
    let cart: CartItem[] = []
    if(typeof window !== "undefined") {
        if(localStorage.getItem('cart')) {
            cart = JSON.parse(localStorage.getItem('cart')!)
        }
        cart.push({
            ...item,
            count: 1
        })
    }

    // 去重
    cart = Array.from(new Set(cart.map(item => item._id))).map(item => {
        return cart.find(product => product._id === item)
    }) as CartItem[]

    localStorage.setItem('cart', JSON.stringify(cart))

    // 执行回调
    next()
}
```

此时调到购物车组件

#### 10.2 购物车组件布局

购物车中左侧显示：购物车中商品列表

右侧：收货地址、总价、结算等

```tsx
import React from 'react'
import Layout from './Layout'
import { Row, Col } from 'antd'

const Cart = () => {
    const showCart = () => (
        <table style={{ width: "100%" }}>
            <thead className="ant-table-thead">
                <tr>
                    <th className="ant-table-cell">商品封面</th>
                    <th className="ant-table-cell">商品名称</th>
                    <th className="ant-table-cell">商品价格</th>
                    <th className="ant-table-cell">商品分类</th>
                    <th className="ant-table-cell">商品数量</th>
                    <th className="ant-table-cell">操作</th>
                </tr>
            </thead>
            <tbody className="ant-table-tbody"></tbody>
        </table>
    )

    return (
        <Layout title="购物车" subTitle="这里是购物车">
            <Row gutter={16}>
                <Col span="16">
                    {showCart()}
                </Col>
                <Col span="8">
                    收货地址
                    总价
                </Col>
            </Row>
        </Layout>
    )
}

export default Cart
```

此时我们希望获取购物车的数据，并在列表中渲染

helper中补充方法

```ts
export const getCart = () => {
    if (typeof window !== "undefined") {
        if (localStorage.getItem('cart')) {
            return JSON.parse(localStorage.getItem('cart')!) as CartItem[]
        }
    }
    return []
}
```

```tsx
<tbody className="ant-table-tbody">
    {cart.map(item => (
        <CartItemFc setCart={setCart} product={item} key={item._id} />
    ))}
</tbody>
```

新建`core/CartItemFc.tsx`组件

```tsx
import React, { FC } from 'react'
import { Image, Input, Button } from 'antd'
import { API } from '../../config'
import { CartItem } from '../../helpers/cart';

interface Props {
    product: CartItem
}

const CartItemFc: FC<Props> = ({ product }) => {
    return (
        <tr className="ant-table-row">
            <td className="ant-table-cell">
                <Image src={`${API}/products/photo/${product._id}`} />
            </td>
            <td className="ant-table-cell">
                {product.name}
            </td>
            <td className="ant-table-cell">
                {product.price}
            </td>
            <td className="ant-table-cell">
                {product.category.name}
            </td>
            <td className="ant-table-cell">
                <Input type="number" value={product.count} />
            </td>
            <td className="ant-table-cell">
                <Button danger type="primary">删除</Button>
            </td>
        </tr>
    )
}

export default CartItemFc
```

#### 10.3 更改购物车中的商品数量

helper中补充更改购物车中商品的数量方法

```ts
export const updateItem = (productId: string, count: number) => {
    let cart: CartItem[] = []
    if (typeof window !== "undefined") {
        if (localStorage.getItem('cart')) {
            cart = JSON.parse(localStorage.getItem('cart')!)
        }
        cart.forEach((item, index) => {
            if (item._id === productId) {
                cart[index].count = count
            }
        })
        localStorage.setItem('cart', JSON.stringify(cart))
    }
    return cart
}
```

先调用updateItem方法，在缓存中更新数量，在把购物车数据更新到state中

Cart组件提供更新方法：

```tsx
const [cart, setCart] = useState<CartItem[]>([])

<tbody className="ant-table-tbody">
    {cart.map(item => (
        <CartItemFc setCart={setCart} product={item} key={item._id} />
    ))}
</tbody>
```

CartItemFc组件中使用

```tsx
const [count, setCount] = useState<number>(product.count)

const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    let count = parseInt(event.target.value)
    setCart(updateItem(product._id, count))
    setCount(count)
}
```



#### 10.4 删除购物车中的商品

同上实现删除操作

完整的helper

```ts
// helpers/cart.ts
/**
 * 将商品添加到购物车
 */

import { Product } from "../store/models/product";

export interface CartItem extends Product {
    count: number
}

export const addItem = (item: Product, next: () => void) => {
    let cart: CartItem[] = []
    if (typeof window !== "undefined") {
        if (localStorage.getItem('cart')) {
            cart = JSON.parse(localStorage.getItem('cart')!)
        }
        cart.push({
            ...item,
            count: 1
        })
    }

    // 去重
    cart = Array.from(new Set(cart.map(item => item._id))).map(item => {
        return cart.find(product => product._id === item)
    }) as CartItem[]

    localStorage.setItem('cart', JSON.stringify(cart))

    // 执行回调
    next()
}

/**
 * 获取本地购物车数据
 */
export const getCart = () => {
    if (typeof window !== "undefined") {
        if (localStorage.getItem('cart')) {
            return JSON.parse(localStorage.getItem('cart')!) as CartItem[]
        }
    }
    return []
}

/**
 * 更改购物车中商品的数量
 */
export const updateItem = (productId: string, count: number) => {
    let cart: CartItem[] = []
    if (typeof window !== "undefined") {
        if (localStorage.getItem('cart')) {
            cart = JSON.parse(localStorage.getItem('cart')!)
        }
        cart.forEach((item, index) => {
            if (item._id === productId) {
                cart[index].count = count
            }
        })
        localStorage.setItem('cart', JSON.stringify(cart))
    }
    return cart
}

/**
 * 删除
 */
export const deleteItem = (productId: string) => {
    let cart: CartItem[] = []
    if (typeof window !== "undefined") {
        if (localStorage.getItem('cart')) {
            cart = JSON.parse(localStorage.getItem('cart')!)
        }
    }
    cart.forEach((item, index) => {
        if (item._id === productId) {
            cart.splice(index, 1)
        }
    })
    localStorage.setItem('cart', JSON.stringify(cart))
    return cart
}
```

CartItem组件

```tsx
// core/CartItem.tsx
import React, { FC, useState, ChangeEvent } from 'react'
import { Image, Input, Button } from 'antd'
import { API } from '../../config'
import { CartItem, updateItem, deleteItem } from '../../helpers/cart';

interface Props {
    product: CartItem,
    setCart: (arg: CartItem[]) => void
}

const CartItemFc: FC<Props> = ({ product, setCart }) => {
    const [count, setCount] = useState<number>(product.count)

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        let count = parseInt(event.target.value)
        setCart(updateItem(product._id, count))
        setCount(count)
    }

    return (
        <tr className="ant-table-row">
            <td className="ant-table-cell">
                <Image src={`${API}/products/photo/${product._id}`} />
            </td>
            <td className="ant-table-cell">
                {product.name}
            </td>
            <td className="ant-table-cell">
                {product.price}
            </td>
            <td className="ant-table-cell">
                {product.category.name}
            </td>
            <td className="ant-table-cell">
                <Input type="number" value={product.count} onChange={handleChange} />
            </td>
            <td className="ant-table-cell">
                <Button danger type="primary" onClick={() => setCart(deleteItem(product._id))}>删除</Button>
            </td>
        </tr>
    )
}

export default CartItemFc
```

#### 10.5 更改收货地址

在Cart组件右侧添加收货地址输入框

```tsx
const [address, setAddress] = useState<string>("")

<Row>
    <Input value={address} onChange={(event: ChangeEvent<HTMLInputElement>) => setAddress(event.target.value)} placeholder="请填写收货地址" />
</Row>
```

#### 10.5 计算商品总价

收货地址下面添加计算总价

```tsx
 const [totalPrice, setTotalPrice] = useState<number>(0)

<Row>
    <TotalPrice cart={cart} setTotalPrice={setTotalPrice} />
</Row>
```

新建`core/TotalPrice`组件：

```tsx
import React, { FC, useEffect } from 'react'
import { Typography } from 'antd'
import { CartItem } from '../../helpers/cart';

const { Title } = Typography

interface Props {
    cart: CartItem[],
    setTotalPrice: (price: number) => void
}

const TotalPrice: FC<Props> = ({ cart, setTotalPrice }) => {
    const getTotalPrice = () => {
        return cart.reduce((currentValue, nextValue) => {
            return (currentValue += nextValue.price * nextValue.count)
        }, 0).toFixed(2)
    }

    useEffect(() => {
        setTotalPrice(parseFloat(getTotalPrice()))
    }, [cart])

    return <Title level={5}>商品总价：{getTotalPrice()}</Title>
}

export default TotalPrice
```






