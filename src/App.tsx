import React, { useState, ChangeEvent, useContext } from 'react'
import FrontPage from './components/FrontPage'
import SettingsPage from './components/SettingsPage'
import nut from './images/nut.png'
import home from './images/home.png'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import LoginPage from './components/LoginPage'
import login from './images/login.png'
import Firebase from './firebase'
import { AuthProvider } from './Auth'
import PrivateRoute from './PrivateRoute'
import Login from './components/Login'
import SignUp from './components/SignUp'
import signout from './images/signout.png'
import { AuthContext } from './Auth'

export default () => {
    const firestore = Firebase.firestore()
    const { currentUser } = useContext(AuthContext)

    return (
        <div>
            <div className={`flex w-full flex-col `}>
                <AuthProvider>
                    <div>
                        <Router>
                            <div
                                className={`flex flex-row mx-4 ${
                                    !!currentUser ? 'visible' : ''
                                }`}
                            >
                                <div className="flex flex-row w-1/2">
                                    <Link to="/">
                                        <img
                                            className="w-16 h-16 mt-1"
                                            src={home}
                                            alt=""
                                        />
                                    </Link>
                                    <Link to="/create">
                                        {' '}
                                        <img
                                            className="w-16 h-16 mt-1"
                                            src={nut}
                                            alt=""
                                        />
                                    </Link>
                                </div>
                                <div className="w-1/2 flex justify-end items-center">
                                    <Link to="/signup">
                                        {' '}
                                        <img
                                            className="w-12 h-12 mt-1"
                                            src={login}
                                            alt=""
                                        />
                                    </Link>
                                </div>
                                <button
                                    onClick={() => Firebase.auth().signOut()}
                                >
                                    <img
                                        src={signout}
                                        className="w-16 h-16 mt-1"
                                        alt=""
                                    />
                                </button>
                            </div>

                            <Switch>
                                <Route path="/create">
                                    <SettingsPage />
                                </Route>
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
