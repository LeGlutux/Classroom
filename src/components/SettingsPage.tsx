import React, {
    useState,
    ChangeEvent,
    Component,
    useEffect,
    useContext,
} from 'react'
import CreateGroups from './Create/CreateGroups'
import CreateStudent from './Create/CreateStudent'
import NavBar from './NavBar'
import { useGroups } from '../hooks'
import Firebase from 'firebase/app'
import 'react-datepicker/dist/react-datepicker.css'
import firebase from 'firebase'
import { AuthContext } from '../Auth'
import { usePeriodes, useRunningPeriode } from '../hooks'
import PeriodeFilter from './PeriodeFilter'

interface SettingsPageProps {
    user: firebase.User
}
export default ({ user }: SettingsPageProps) => {
    const { groups, refreshGroups } = useGroups(user.uid)
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
        <div className="w-full h-screen flex flex-col">
            <NavBar />
            <div className="overflow-y-scroll">
                <div className="w-full bg-gray-100">
                    <CreateGroups onAddGroup={refreshGroups} />
                    <CreateStudent groups={groups} />
                </div>
                <div className="flex flex-col mt-2 overflow-y-scroll">
                    <div className="flex flex-col items-center rounded mt-5 h-auto justify-around mx-6 bg-gray-100 shadow-custom">
                        <div className="text-gray-800 font-studentName text-lg">
                            En cours : Période {runningPeriode}
                        </div>
                        <button
                            className="flex h-8 w-56 self-center bg-orange-500 rounded text-white flex text-lg font-bold justify-center mt-2"
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

                        <div>
                            <button
                                className="bg-red-300"
                                onClick={() => Firebase.auth().signOut()}
                            >
                                Se déconnecter
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
