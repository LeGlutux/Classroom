import React from 'react'
import FrontPage from './components/FrontPage'
import SettingsPage from './components/SettingsPage'
import StudentStats from './components/StudentStats'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { AuthProvider } from './Auth'
import PrivateRoute from './PrivateRoute'
import Login from './components/Login'
import SignUp from './components/SignUp'
import Lists from './components/Lists'

export default () => {
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
                                <PrivateRoute path="/lists" component={Lists} />

                                <Route path="/login">
                                    <Login />
                                </Route>

                                <Route path="/signup">
                                    <SignUp />
                                </Route>
                                <PrivateRoute
                                    path="/student/:id"
                                    component={StudentStats}
                                />
                                <PrivateRoute path="/" component={FrontPage} />
                            </Switch>
                        </Router>
                    </div>
                </AuthProvider>
            </div>
        </div>
    )
}
