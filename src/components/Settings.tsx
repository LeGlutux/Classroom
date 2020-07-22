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
        <div className="w-full h-screen flex flex-col">
            <NavBar />
            <div className="flex flex-col mt-2 overflow-y-scroll">
                <div className="ml-4 flex flex-col">
                    <div className="font-bold text-orange-500 my-4">
                        CONFIGURER LES PÉRIODES
                    </div>
                    <div>En cours : Période {runningPeriode}</div>
                    <button
                        className="mb-20"
                        onClick={() => {
                            handleAddPeriode()
                            refreshPeriodes()
                            refreshRunningPeriode()
                            db.collection('users')
                                .doc(currentUser.uid)
                                .update({ runningPeriode: periodes.length + 1 })
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

                    <div className="font-bold text-orange-500 mt-12 mb-4">
                        CONFIGURER L'AFFICHAGE
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="flex flex-row items-center">
                            <input
                                type="checkbox"
                                className={`ml-8 mr-2 h-4 w-4`}
                                checked={checkDisplayTrimestre}
                                onChange={(e) =>
                                    setCheckDisplayTrimestre(
                                        !checkDisplayTrimestre
                                    )
                                }
                            />
                            <div>Afficher les périodes</div>
                        </div>
                        <div className="flex flex-row items-center">
                            <input
                                type="checkbox"
                                className={`ml-8 mr-2 h-4 w-4`}
                                checked={checkDisplayGroups}
                                onChange={(e) =>
                                    setCheckDisplayGroups(!checkDisplayGroups)
                                }
                            />
                            <div>Afficher les groupes</div>
                        </div>
                    </div>
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
    )
}
