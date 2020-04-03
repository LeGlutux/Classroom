import React, { useState, ChangeEvent } from 'react'
import Student from './components/Student'
import data from './data'
import ClassListFilter from './components/ClassListFilter'
import FrontPage from './components/FrontPage'
import SettingsPage from './components/SettingsPage'
import nut from './images/nut.png'

export default () => {
    const [page, setPage] = useState(FrontPage)

    return (
        <div className="flex w-full h-screen flex-col">
            <div className="w-full">
                <button
                    className="mt-3 hover:opacity-50"
                    onClick={() => setPage(SettingsPage)}
                >
                    <img className="h-12 w-12" src={nut} alt="" />
                </button>
            </div>

    <FrontPage />
        </div>
    )
}
