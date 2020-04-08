import React, { useState, ChangeEvent } from 'react'
import FrontPage from './components/FrontPage'
import SettingsPage from './components/SettingsPage'
import nut from './images/nut.png'
import home from './images/home.png'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import LoginPage from './components/LoginPage'
import login from './images/login.png'

export default () => {
    const [logging, setLogging] = useState(true)
    return (
        <div className="flex w-full h-screen flex-col">
            <div className="w-full">
                <Router>
                    <div className="flex flex-row mx-4">
                        <div className="flex flex-row w-1/2">
                            <Link to="/home">
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
                        <Route path="/login">
                            <LoginPage />
                        </Route>
                        <Route path="/home">
                            <FrontPage />
                        </Route>
                        <Route path="/create">
                            <SettingsPage />
                        </Route>
                    </Switch>
                </Router>
            </div>
        </div>
    )
}
