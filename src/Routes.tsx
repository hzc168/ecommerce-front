import React from 'react'
import { HashRouter, Switch, Route } from 'react-router-dom'
import AdminDashboard from './components/admin/AdminDashboard'
import AdminPrivateRoute from './components/admin/AdminPrivateRoute'
import Dashboard from './components/admin/Dashboard'
import PrivateRoute from './components/admin/PrivateRoute'
import Home from './components/core/Home'
import Shop from './components/core/Shop'
import Signin from './components/core/Signin'
import Signup from './components/core/Signup'

const Routes = () => {
    return (
        <HashRouter>
            <Switch>
                <Route path="/" component={Home} exact />
                <Route path="/shop" component={Shop} />
                <Route path="/signin" component={Signin} />
                <Route path="/signup" component={Signup} />
                <PrivateRoute path="/user/dashboard" component={Dashboard} />
                <AdminPrivateRoute path="/admin/dashboard" component={AdminDashboard} />
            </Switch>
        </HashRouter>
    )
}

export default Routes