import React, { useContext } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { AuthContext } from './Auth'
import AuthSplash from './components/AuthSplash'

const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
    const { currentUser, authReady } = useContext(AuthContext)
    return (
        <Route
            {...rest}
            render={(routeProps) => {
                if (!authReady) return <AuthSplash />
                if (!currentUser) return <Redirect to="/" />
                return <RouteComponent user={currentUser} {...routeProps} />
            }}
        />
    )
}

export default PrivateRoute
