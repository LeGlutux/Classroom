import React, { useContext, useState } from 'react'
import CreateGroups from './Create/CreateGroups'
import CreateStudent from './Create/CreateStudent'
import NavBar from './NavBar'
import { useGroups, useLists } from '../hooks'
import Firebase from 'firebase/app'
import 'react-datepicker/dist/react-datepicker.css'
import firebase from 'firebase/app'
import { AuthContext } from '../Auth'
import { usePeriodes, useRunningPeriode, useStudents } from '../hooks'
import PeriodeFilter from './PeriodeFilter'
import calendar from '../images/calendar.png'
import ConfirmModal from './ConfirmModal'
import { useHistory } from 'react-router-dom'

export default () => {
    const [confirm, setConfirm] = useState(false)
    const [confirm2, setConfirm2] = useState(false)
    const { currentUser } = useContext(AuthContext)
    if (currentUser === null) return <div />
    const { groups, refreshGroups } = useGroups(currentUser.uid)
    const { runningPeriode, refreshRunningPeriode } = useRunningPeriode(
        currentUser.uid
    )
    const history = useHistory()
    const { students } = useStudents(currentUser.uid)
    const { periodes, refreshPeriodes } = usePeriodes(currentUser.uid)
    const lists = useLists(currentUser.uid)
    const db = firebase.firestore()
    

    const handleAddPeriode = () => {
        db.collection('users')
            .doc(currentUser.uid)
            .update({
                periodes: firebase.firestore.FieldValue.arrayUnion(new Date()),
            })
    }
    const handleDeleteAll = () => {
        students.forEach((student) => {

            lists.forEach((l => {
                db.collection('users')
                    .doc(currentUser.uid)
                    .collection('eleves')
                    .doc(student.id)
                    .collection('listes')
                    .doc(l.id.concat('s'))
                    .delete()
            }))

           
            db.collection('users')
                .doc(currentUser.uid)
                .collection('eleves')
                .doc(student.id)
                .delete()
        })
        lists.forEach((l) => {
            db.collection('users')
                .doc(currentUser.uid)
                .collection('lists')
                .doc(l.id)
                .delete()
        })


        db.collection('users')
            .doc(currentUser.uid)
            .update({
                classes: [] as string[],
                periodes: [new Date()],
                runningPeriode: 1 as number,
            })
            history.replace('/')
    }

    const handleNewPeriode = () => {
        handleAddPeriode()
        refreshPeriodes()
        refreshRunningPeriode()
        db.collection('users')
            .doc(currentUser.uid)
            .update({
                runningPeriode: periodes.length + 1,
            })
        refreshRunningPeriode()
        history.goBack()
    }

    return (
        <div className="w-full h-screen flex flex-col">
            <ConfirmModal
                confirm={confirm}
                setConfirm={setConfirm}
                confirmAction={handleNewPeriode}
                textBox={
                    'Êtes-vous sûr(e) de vouloir commencer une nouvelle période ?'
                }
                subTextBox={
                    'En faisant cela, vous ne pourrez plus ajouter de croix pour les périodes précédentes'
                }
            />
            <ConfirmModal
                confirm={confirm2}
                setConfirm={setConfirm2}
                confirmAction={handleDeleteAll}
                textBox={
                    'Êtes-vous sûr(e) de vouloir supprimer toutes les données ?'
                }
                subTextBox={
                    'En faisant cela, vous supprimez définitivement vos élèves et vos classes'
                }
            />
            <div className="overflow-y-scroll">
                <div className="w-full bg-gray-100 flex flex-col xl:flex-row xl:flex-wrap xl:justify-around">
                    <CreateGroups onAddGroup={refreshGroups} />
                    <CreateStudent groups={groups} currentUserId={currentUser.uid} />
                </div>
                <div className="flex flex-col mt-5 shadow-custom mx-6 bg-gray-100 pb-4 rounded xl:mt-12 xl:mx-64">
                    <div className="flex flex-col h-auto items-center justify-around">
                        <div className="flex flex-row items-center mb-5">
                            <img className="w-8 h-8" src={calendar} alt="" />
                            <div className="text-gray-800 font-studentName text-lg ml-2">
                                En cours : Période {runningPeriode}
                            </div>
                        </div>

                        <button
                            className="flex h-16 w-56 self-center bg-orange-500 rounded text-white text-lg font-bold justify-center pt-1 mb-5 flex-wrap"
                            onClick={() => setConfirm(true)}
                        >
                            {' '}
                            Commencer une nouvelle période
                        </button>
                        <PeriodeFilter
                            periodes={periodes}
                            currentUser={currentUser.uid}
                            refresh={refreshRunningPeriode}
                        />
                    </div>
                </div>
                <div className="flex flex-col mt-5 shadow-custom mx-6 bg-gray-100 pb-4 rounded xl:mt-12 xl:mx-64">
                    <div className="flex flex-col h-auto items-center justify-around">
                        <button
                            className="flex h-16 w-56 mt-8 self-center bg-red-500 rounded text-white text-lg font-bold justify-center pt-1 mb-5 flex-wrap"
                            onClick={() => setConfirm2(true)}
                        >
                            {' '}
                            Supprimer toutes les données
                        </button>
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
            </div>
            <div className={`w-full h-12 bg-gray-300 table-footer-group`}>
                <NavBar />
            </div>
        </div>
    )
}
