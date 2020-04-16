import React, { useState, ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import nut from '../images/nut.png'
import home from '../images/home.png'
import login from '../images/login.png'
import Firebase from '../firebase'
import signout from '../images/signout.png'

export default () => {
    return (
        <div className={`flex flex-row mx-4 `}>
            <div className={`flex flex-row w-1/2  `}>
                <Link to="/">
                    <img className="w-16 h-16 mt-1" src={home} alt="" />
                </Link>
                <Link to="/create">
                    {' '}
                    <img className="w-16 h-16 mt-1" src={nut} alt="" />
                </Link>
            </div>
            <div className="w-1/2 flex justify-end items-center">
                <Link to="/login">
                    {' '}
                    <img className="w-12 h-12 mt-1" src={login} alt="" />
                </Link>
            </div>
            <button onClick={() => Firebase.auth().signOut()}>
                <img src={signout} className="w-16 h-16 mt-1" alt="" />
            </button>
        </div>
    )
}
