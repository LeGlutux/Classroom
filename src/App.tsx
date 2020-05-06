import React from 'react'
import FrontPage from './components/FrontPage'
import SettingsPage from './components/SettingsPage'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { AuthProvider } from './Auth'
import PrivateRoute from './PrivateRoute'
import Login from './components/Login'
import SignUp from './components/SignUp'
import { usePaths } from './hooks'

export default () => {
    const { paths, refreshPaths } = usePaths()
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
