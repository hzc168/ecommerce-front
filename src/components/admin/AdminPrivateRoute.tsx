import React, { FC } from 'react'
import { Route, RouteProps, Redirect } from 'react-router-dom'
import { isAuth } from '../../helpers/auth'
import { Jwt } from '../../store/models/auth'

interface AdminPrivateRouteProps extends RouteProps {
    component: React.ComponentType<any>
}

const AdminPrivateRoute: FC<AdminPrivateRouteProps> = ({
    component: Component,
    ...rest
}) => {
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
}

export default AdminPrivateRoute
