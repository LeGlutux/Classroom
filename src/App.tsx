import React, { useState, ChangeEvent, useContext } from 'react'
import FrontPage from './components/FrontPage'
import SettingsPage from './components/SettingsPage'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Firebase from './firebase'
import { AuthProvider } from './Auth'
import PrivateRoute from './PrivateRoute'
import Login from './components/Login'
import SignUp from './components/SignUp'
import { AuthContext } from './Auth'

export default () => {
    const firestore = Firebase.firestore()
    const { currentUser } = useContext(AuthContext)

    return (
        <div>
            <div className={`flex w-full flex-col`}>
                <AuthProvider>
                    <div>
                        <Router>
                            <Switch>
                                <PrivateRoute
                                    path="/create"
                                    component={SettingsPage}
                                />
                                <Route path="/login">
                                    <Login />
                                </Route>
                                <Route path="/signup">
                                    <SignUp />
                                </Route>
                                <PrivateRoute path="/" component={FrontPage} />
                            </Switch>
                        </Router>
                    </div>
                </AuthProvider>
            </div>
        </div>
    )
}
