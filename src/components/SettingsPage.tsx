import React, { useState, ChangeEvent, Component, useEffect } from 'react'
import CreateGroups from './Create/CreateGroups'
import CreateStudent from './Create/CreateStudent'
import NavBar from './NavBar'
import { useGroups } from '../hooks'

interface SettingsPageProps {
    user: firebase.User
}
export default ({ user }: SettingsPageProps) => {
    const { groups, refreshGroups } = useGroups(user.uid)

    return (
        <div className="w-full h-screen flex flex-col">
            <NavBar />
            <div className="h-full w-full bg-gray-100">
                <CreateGroups onAddGroup={refreshGroups} />
                <CreateStudent groups={groups} />
            </div>
        </div>
    )
}
