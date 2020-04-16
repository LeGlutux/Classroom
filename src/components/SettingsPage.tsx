import React, { useState, ChangeEvent } from 'react'
import CreateGroups from './Create/CreateGroups'
import CreateStudent from './Create/CreateStudent'
import NavBar from './NavBar'

interface SettingsPageProps {
    user: firebase.User
}
export default ({ user }: SettingsPageProps) => {
    return (
        <div className="w-full h-screen flex flex-col px-2">
            <NavBar />
            <div className="h-full w-full p-2">
                <CreateGroups />
                <CreateStudent />
            </div>
        </div>
    )
}
