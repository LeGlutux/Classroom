import React, { useState, ChangeEvent, Component, useEffect } from 'react'
import NavBar from './NavBar'
import Firebase from 'firebase/app'

export default () => {
    return (
        <div className="w-full h-screen flex flex-col">
            <NavBar />
            <div>
                <button onClick={() => Firebase.auth().signOut()}>
                    Sign Out
                </button>
            </div>
        </div>
    )
}
