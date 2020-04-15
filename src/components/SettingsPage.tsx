import React, { useState, ChangeEvent } from 'react'
import CreateGroups from './Create/CreateGroups'
import CreateStudent from './Create/CreateStudent'
import createBackground from '../images/createBackground.jpg'

export default () => {
    return (
        <div
            className="w-full h-screen flex flex-col flex items-center px-2"
            style={{ backgroundImage: `url(${createBackground})` }}
        >
            <div className="h-full w-full p-2">
                <CreateGroups />
                <CreateStudent />
            </div>
        </div>
    )
}
