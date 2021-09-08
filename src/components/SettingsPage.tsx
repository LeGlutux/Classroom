import React, { useContext, useRef, useState } from 'react'
import CreateGroups from './Create/CreateGroups'
import CreateStudent from './Create/CreateStudent'
import NavBar from './NavBar'
import { useGroups, useLists } from '../hooks'
import Firebase from 'firebase/app'
import 'react-datepicker/dist/react-datepicker.css'
import firebase from 'firebase/app'
import { AuthContext } from '../Auth'
import { usePeriodes, useStudents } from '../hooks'
import PeriodeFilter from './PeriodeFilter'
import calendar from '../images/calendar.png'
import ConfirmModal from './ConfirmModal'
import { useHistory } from 'react-router-dom'
import { cards } from '../classes'
import openCard from '../images/openCard.png'
import closeCard from '../images/closeCard.png'



export default () => {
    const [confirm, setConfirm] = useState(false)
    const [confirm2, setConfirm2] = useState(false)
    const { currentUser } = useContext(AuthContext)
    if (currentUser === null) return <div />
    const { groups, refreshGroups } = useGroups(currentUser.uid)
    const history = useHistory()
    const { students } = useStudents(currentUser.uid)
    const { periodes, refreshPeriodes, runningPeriode, refreshRunningPeriode } = usePeriodes(currentUser.uid)
    const { lists } = useLists(currentUser.uid)
    const db = firebase.firestore()

    const xScroller = useRef<HTMLDivElement>(null)
    const ref0 = useRef<HTMLDivElement>(null)
    const ref1 = useRef<HTMLDivElement>(null)
    const ref2 = useRef<HTMLDivElement>(null)
    const ref3 = useRef<HTMLDivElement>(null)

    const refs = [ref0, ref1, ref2, ref3]

    const scrollTo = (refN: number) => refs[refN].current?.scrollIntoView({ behavior: "smooth", block: "end", inline: "center" })
    const [hide, setHide] = useState(false)
    const [actualRef, setActualRef] = useState<number>(0)

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
        <div className={`w-full h-screen flex flex-col`}>
            <div className="flex flex-row w-full h-12 border-b-2 border-gray-400 items-center font-title font-bold justify-center text-4xl rounded-b-full">
                Paramétrez votre année
            </div>
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
            <div className={`flex w-full justify-between px-6 settings-page-arrows z-1`}>

                <button
                    className={`${actualRef === 0 || hide ? 'invisible' : 'visible'}`}
                    onClick={() => {

                        scrollTo(actualRef - 1)
                        setActualRef(actualRef - 1)
                        setHide(true)
                        setTimeout(() => setHide(false), 400)
                    }}
                >
                    <img className="w-4" src={closeCard} alt="" />
                </button>
                <button
                    className={`${actualRef === 3 || hide ? 'invisible' : 'visible'}`}
                    onClick={() => {
                        scrollTo(actualRef + 1)
                        setActualRef(actualRef + 1)
                        setHide(true)
                        setTimeout(() => setHide(false), 400)
                    }
                    }>
                    <img className="w-4" src={openCard} alt="" />
                </button>
            </div>

            <div
                className={`flex flex-row h-full overflow-x-hidden py-8 items-center px-8`}
                ref={xScroller}
            >

                <div className={cards} ref={ref0}>
                    <CreateGroups
                        onAddGroup={refreshGroups} />
                </div>

                <div className={cards} ref={ref1}>
                    <CreateStudent
                        groups={groups}
                        currentUserId={currentUser.uid} />
                </div>


                <div className={`${cards}`}
                    ref={ref2}>
                    <div className="flex flex-col h-full items-center pb-4">
                        <div className='flex flex-col h-full justify-around items-center'>
                            <div className='relative top-0 font-title text-3xl text-center'>Lancer une nouvelle période</div>
                            <div className="flex flex-row items-center mb-5">
                                <img className="w-8 h-8" src={calendar} alt="" />
                                <div className="text-gray-800 font-studentName text-lg ml-2">
                                    En cours : Période {runningPeriode}
                                </div>
                            </div>
                            <button
                                className="flex h-16 w-56 self-center bg-orange-500 rounded text-white text-lg font-bold justify-center pt-1 mb-5 pb-2 flex-wrap"
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
                </div>

                <div className={cards}

                    ref={ref3}>
                    <div className="flex flex-col h-full justify-around items-center">
                        <div className='flex flex-col h-full justify-around items-center'>
                            <div className='relative top-0 font-title text-3xl text-center'>L'année est finie ?</div>
                            <button
                                className="flex h-16 w-56 mt-8 self-center bg-red-500 rounded text-white text-lg font-bold justify-center pt-1 mb-5 flex-wrap"
                                onClick={() => setConfirm2(true)}
                            >
                                {' '}
                                Supprimer toutes les données
                            </button>
                        </div>
                    </div>

                </div>


            </div>
            <div className='w-full mb-6 h-16 bg-white'>
                <div className="my-8 flex justify-center bg-white">
                    <button
                        className="text-lg text-gray-700 font-bold"
                        onClick={() => Firebase.auth().signOut()}
                    >
                        Se déconnecter
                    </button>
                </div>
            </div>

            <div className={`w-full h-12 bg-gray-300 sticky bottom-0`}>
                <NavBar />
            </div>
        </div>
    )
}
