import React, { useState, ChangeEvent } from 'react'
import CreateGroups from './Create/CreateGroups'
import CreateStudent from './Create/CreateStudent'

export default () => {
    return (
        <div className="w-full h-screen flex flex-col flex items-center bg-gray-400">
            <CreateGroups groups={[{ name: 'Tous' }]} />
            <CreateStudent />
        </div>
    )
}
