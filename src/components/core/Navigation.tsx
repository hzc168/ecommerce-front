import { Menu, Badge } from 'antd'
import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { AppState } from '../../store/reducers'
import { RouterState } from 'connected-react-router'
import { isAuth } from '../../helpers/auth'
import { Jwt } from '../../store/models/auth'
import { TotalContext } from '../../anotherStore'
import { itemCount } from '../../helpers/cart'

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
    const isCart = useActive(pathname, '/cart')
    const isDashboard = useActive(pathname, getDashboardUrl())

    const [count, setCount] = useContext(TotalContext)

    useEffect(() => {
        setCount(itemCount())
    })

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
            <Menu.Item className={isCart} key="cart">
                <Link to="/cart">
                    购物车
                    <Badge count={count} offset={[5, -10]} />
                </Link>
            </Menu.Item>
            {
                !isAuth() && (
                    <>
                        <Menu.Item className={isSignin} key="signin">
                            <Link to="/signin">登录</Link>
                        </Menu.Item>
                        <Menu.Item className={isSignup} key="signup">
                            <Link to="/signup">注册</Link>
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
