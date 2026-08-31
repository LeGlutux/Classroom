import React, { useContext } from 'react'
import FrontPage from './components/FrontPage'
import SettingsPage from './components/SettingsPage'
import StudentStats from './components/StudentStats'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from 'react-router-dom'
import { AuthContext, AuthProvider } from './Auth'
import PrivateRoute from './PrivateRoute'
import Login from './components/Login'
import SignUp from './components/SignUp'
import Lists from './components/Lists'
import CreateList from './components/CreateList'
import List from './components/List'
import InstallAppHost from './components/InstallApp'
import SmsHost from './components/SmsSheet'
import AppTutorialHost from './components/AppTutorial'
import AuthSplash from './components/AuthSplash'

const HomeRoute = () => {
    const { currentUser, authReady } = useContext(AuthContext)
    if (!authReady) return <AuthSplash />
    if (!currentUser) return <Login />
    return <FrontPage />
}

export default () => {
    return (
        <div>
            <div className={`flex w-full flex-col`}>
                <AuthProvider>
                    <InstallAppHost />
                    <div>
                        <Router>
                            <SmsHost />
                            <AppTutorialHost />
                            <Switch>
                                <PrivateRoute
                                    path="/create"
                                    component={SettingsPage}
                                />
                                <PrivateRoute path="/lists" component={Lists} />
                                <PrivateRoute
                                    path="/createlist"
                                    component={CreateList}
                                />
                                <PrivateRoute
                                    path="/list/:id"
                                    component={List}
                                />

                                <Route path="/login">
                                    <Redirect to="/" />
                                </Route>
                                <Route path="/signup">
                                    <SignUp />
                                </Route>
                                <PrivateRoute
                                    path="/student/:id"
                                    component={StudentStats}
                                />
                                <Route exact path="/" component={HomeRoute} />
                                <Redirect to="/" />
                            </Switch>
                        </Router>
                    </div>
                </AuthProvider>
            </div>
        </div>
    )
}
