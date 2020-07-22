import React, { useContext } from 'react'
import CreateGroups from './Create/CreateGroups'
import CreateStudent from './Create/CreateStudent'
import NavBar from './NavBar'
import { useGroups } from '../hooks'
import Firebase from 'firebase/app'
import 'react-datepicker/dist/react-datepicker.css'
import firebase from 'firebase/app'
import { AuthContext } from '../Auth'
import { usePeriodes, useRunningPeriode } from '../hooks'
import PeriodeFilter from './PeriodeFilter'
import calendar from '../images/calendar.png'

export default () => {
    const { currentUser } = useContext(AuthContext)
    if (currentUser === null) return <div />
    const { groups, refreshGroups } = useGroups(currentUser.uid)

    const { runningPeriode, refreshRunningPeriode } = useRunningPeriode(
        currentUser.uid
    )
    const { periodes, refreshPeriodes } = usePeriodes(currentUser.uid)
    const db = firebase.firestore()

    const handleAddPeriode = () => {
        db.collection('users')
            .doc(currentUser.uid)
            .update({
                periodes: firebase.firestore.FieldValue.arrayUnion(new Date()),
            })
    }

    return (
        <div className="w-full h-screen flex flex-col">
            <NavBar />
            <div className="overflow-y-scroll">
                <div className="w-full bg-gray-100">
                    <CreateGroups onAddGroup={refreshGroups} />
                    <CreateStudent groups={groups} />
                </div>

                <div className="flex flex-col mt-5 overflow-y-scroll shadow-custom mx-6 bg-gray-100 pb-4 rounded">
                    <div className="flex flex-col h-auto items-center justify-around">
                        <div className="flex flex-row items-center mb-5">
                            <img className="w-8 h-8" src={calendar} alt="" />
                            <div className="text-gray-800 font-studentName text-lg ml-2 ">
                                En cours : Période {runningPeriode}
                            </div>
                        </div>

                        <button
                            className="flex h-8 w-56 self-center bg-orange-500 rounded text-white flex text-lg font-bold justify-center mt-2 mb-5"
                            onClick={() => {
                                handleAddPeriode()
                                refreshPeriodes()
                                refreshRunningPeriode()
                                db.collection('users')
                                    .doc(currentUser.uid)
                                    .update({
                                        runningPeriode: periodes.length + 1,
                                    })
                                refreshRunningPeriode()
                            }}
                        >
                            {' '}
                            Ajouter une période
                        </button>

                        <PeriodeFilter
                            periodes={periodes}
                            currentUser={currentUser.uid}
                            refresh={refreshRunningPeriode}
                        />
                    </div>
                </div>
                <div className='"w-full bg-gray-100"'>
                    <div className="my-8 flex justify-center bg-white">
                        <button
                            className="text-lg text-gray-700 font-bold"
                            onClick={() => Firebase.auth().signOut()}
                        >
                            Se déconnecter
                        </button>
                    </div>
                </div>
                <div className="w-full flex justify-end">
                    <div className="font-title text-xs mr-5 mb-2">
                        An app by Marie and Leo
                    </div>
                </div>
            </div>
        </div>
    )
}
