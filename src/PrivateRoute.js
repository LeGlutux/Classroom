import React, { useContext } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { AuthContext } from "./Auth"

const PrivateRoute = ({component: RouteComponent, ...rest}) => {
    const {currentUser} = useContext(AuthContext)
    return (
        <Route
        {...rest}
        render={routeProps => 
            !!currentUser ? (
            <RouteComponent user = {currentUser} {...routeProps} />
            ) : 
            (
                console.log('redirection off')
                // <Redirect to={"/"} />
            )
        }
        />
    )
}

export default PrivateRoute