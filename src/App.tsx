import React, { useState, ChangeEvent } from 'react'
import FrontPage from './components/FrontPage'
import SettingsPage from './components/SettingsPage'
import nut from './images/nut.png'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'

export default () => {
    const [flag, setFlag] = useState(true)

    return (
        <div className="flex w-full h-screen flex-col">
            <div className="w-full">
                <button
                    className="mt-3 hover:opacity-50"
                    onClick={() => setFlag(!flag)}
                >
                    <img className="h-12 w-12" src={nut} alt="" />
                </button>
            </div>
            <div>
                <Router>
                    <li>
                        <Link to="/">
                            >
                            <img src={nut} alt="" />
                        </Link>
                    </li>
                    <li>
                        <Link to="/">
                            {' '}
                            to="/create">
                            <img src={nut} alt="" />
                        </Link>
                    </li>
                </Router>
                <Switch>
                    <Route path="/">
                        <FrontPage />
                    </Route>
                    <Route path="/create">
                        <SettingsPage />
                    </Route>
                </Switch>
            </div>
        </div>
    )
}
