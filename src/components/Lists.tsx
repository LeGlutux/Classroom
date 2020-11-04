import React, { useContext, useState } from 'react'
import firebase from 'firebase/app'
import { useLists, useStudents } from '../hooks'
import { AuthContext } from '../Auth'
import NavBar from './NavBar'
import add from '../images/add.png'

interface ListsProps {}

export default (props: ListsProps) => {
    const { currentUser } = useContext(AuthContext)
    if (currentUser === null) return <div />
    const lists = useLists(currentUser.uid)
    const db = firebase.firestore()
    const students = useStudents(currentUser.uid)
    return (
        <div className="h-screen w-full flex flex-col">
            <div className="h-24">
                <NavBar />
            </div>
            <div className="flex flex-row w-full h-12 border-t-4 border-b-4 border-gray-600 items-center">
                <img className="mx-8" src={add} alt="" />
                <div className="font-studentName mx-4">
                    Créer une nouvelle list
                </div>
            </div>
        </div>
    )
}
