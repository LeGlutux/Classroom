import React, { useState, ChangeEvent } from 'react'
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

export default () => {
    const [logging, setLogging] = useState(true)
    const firestore = Firebase.firestore()
    const f = { leo: 'yo' }

    return (
        <div>
            <button onClick={() => Firebase.auth().signOut()}>Sign Out</button>
            <div>
                <LoginPage onLog={() => setLogging(false)} signin={''} />
                {/* <Router>
                    <Switch>
                        {' '}
                        <Route path="/signin">
                            <SignIn />
                        </Route>
                    </Switch>
                </Router> */}
            </div>

            <div
                className={`flex w-full flex-col ${
                    logging ? 'invisible h-0' : 'h-screen'
                }`}
            >
                <AuthProvider>
                    <div className="w-full">
                        <Router>
                            <div className="flex flex-row mx-4">
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
                                    <Link to="/login">
                                        {' '}
                                        <img
                                            className="w-12 h-12 mt-1"
                                            src={login}
                                            alt=""
                                        />
                                    </Link>
                                </div>
                            </div>

                            <Switch>
                                <Route path="/create">
                                    <SettingsPage />
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
