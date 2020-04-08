import React, { useState, ChangeEvent } from 'react'
import CreateGroups from './Create/CreateGroups'
import CreateStudent from './Create/CreateStudent'

export default () => {
    return (
        <div className="w-full h-screen flex flex-col flex items-center px-2">
            <div className="h-full w-full p-2 bg-gray-400">
                <CreateGroups />
                <CreateStudent />
            </div>
        </div>
    )
}
