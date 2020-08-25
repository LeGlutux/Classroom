import React, { useState, useContext } from 'react'
import NavBar from './NavBar'
import Firebase from 'firebase/app'
import 'react-datepicker/dist/react-datepicker.css'
import firebase from 'firebase/app'
import { AuthContext } from '../Auth'
import { usePeriodes, useRunningPeriode } from '../hooks'
import PeriodeFilter from './PeriodeFilter'

export default () => {
    const { currentUser } = useContext(AuthContext)
    if (currentUser === null) return <div />

    const { runningPeriode, refreshRunningPeriode } = useRunningPeriode(
        currentUser.uid
    )
    const { periodes, refreshPeriodes } = usePeriodes(currentUser.uid)
    const db = firebase.firestore()
    const [checkDisplayTrimestre, setCheckDisplayTrimestre] = useState(false)
    const [checkDisplayGroups, setCheckDisplayGroups] = useState(true)
    // const timeStamp = firebase.firestore.FieldValue.serverTimestamp()
    const handleAddPeriode = () => {
        db.collection('users')
            .doc(currentUser.uid)
            .update({
                periodes: firebase.firestore.FieldValue.arrayUnion(new Date()),
            })
    }

    return (
        <div className="w-full h-full flex flex-col">
            <NavBar />
        </div>
    )
}
