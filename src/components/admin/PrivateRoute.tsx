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
