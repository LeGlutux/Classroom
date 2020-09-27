import React, { useContext, useState } from 'react'
import Student from '../components/Student'
import ClassListFilter from '../components/ClassListFilter'
import NavBar from './NavBar'
import { useGroups, useStudents, useRunningPeriode, useUpdated } from '../hooks'
import { AuthContext } from '../Auth'
import 'firebase/firestore'
import MagicStick from './MagicStick'
import magicStick from '../images/magicStick.png'
import burgerMenu from '../images/burgerMenu.png'
import brain from '../images/brain.png'
import Firebase from '../firebase'
import Updater from './Updater'

export default () => {
    const db = Firebase.firestore()
    const [withMemory, setWithMemory] = useState(false)
    const [menuOpened, setMenuOpened] = useState(false)
    const [displayedGroup, setDisplayedGroup] = useState('tous')
    const [displayRandomStudent, setDisplayRandomStudent] = useState(false)
    const { currentUser } = useContext(AuthContext)
    if (currentUser === null) return <div />
    const updated = useUpdated(currentUser.uid)
    const { students, filterStudents } = useStudents(currentUser.uid)
    const { groups } = useGroups(currentUser.uid)
    const { runningPeriode } = useRunningPeriode(currentUser.uid)

    if (updated) {
        return (
            <div className="w-full h-screen flex flex-col">
                <div className="h-24">
                    <NavBar />
                </div>
                <div className="absolute flex justify-center self-center text-3xl mt-4 text-gray-900 rounded">
                    {'P'.concat(runningPeriode.toString())}
                </div>
                <div className="w-24 absolute flex justify-center self-center">
                    <div
                        className={`rounded-lg bg-white font-studentName font-bold px-6 ${
                            displayedGroup.length > 8
                                ? 'text-sm overflow-hidden mt-3 h-16'
                                : 'text-2xl mt-20'
                        }`}
                        style={{ backgroundColor: 'rgba(255,255,255,0.6)' }}
                    >
                        {displayedGroup}
                    </div>
                </div>
                <MagicStick
                    students={students}
                    displayRandomStudent={displayRandomStudent}
                    setDisplayRandomStudent={setDisplayRandomStudent}
                    withMemory={withMemory}
                />

                <div className="flex w-full h-full flex-col bg-white overflow-y-scroll xl:flex-row xl:flex-wrap xl:content-start">
                    {students.map(
                        ({ name, surname, classes, id, highlight }) => {
                            return (
                                <Student
                                    key={id}
                                    classes={classes}
                                    name={name}
                                    surname={surname}
                                    id={id}
                                    highlight={highlight}
                                />
                            )
                        }
                    )}
                </div>

                <div className="w-full h-12 bg-gray-300 table-footer-group">
                    <div className="ml-3 pt-2 font-bold text-xl flex justify-between align-top">
                        <div className="overflow-x-scroll">
                            <ClassListFilter
                                displayedGroup={displayedGroup}
                                setDisplayedGroup={setDisplayedGroup}
                                onFilter={(group) => {
                                    filterStudents(group)
                                }}
                                groups={groups}
                            />
                        </div>
                        <button
                            onClick={() => {
                                setDisplayRandomStudent(true)
                                setWithMemory(false)
                            }}
                            className={`w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-gray-200 rounded-full bottom-right-custom shadow-custom flex items-center justify-center ${
                                menuOpened ? 'visible' : 'invisible'
                            }`}
                        >
                            <img
                                className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-16 xl:h-16 pb-1"
                                src={magicStick}
                                alt="élève aléatoire"
                            />
                        </button>
                        <button
                            onClick={() => {
                                setDisplayRandomStudent(true)
                                setWithMemory(true)
                            }}
                            className={`w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-gray-200 rounded-full bottom-right-custom2 shadow-custom flex items-center justify-center ${
                                menuOpened ? 'visible' : 'invisible'
                            }`}
                        >
                            <img
                                className="w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 xl:w-20 xl:h-20"
                                src={brain}
                                alt="élève aléatoire avec mémoire"
                            />
                        </button>
                        <button
                            onClick={() => {
                                setMenuOpened(!menuOpened)
                            }}
                            className="mr-6 w-8 h-8 text-gray-700 rounded"
                        >
                            <img src={burgerMenu} alt="" />
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full h-screen flex flex-col">
            <div
                className={`flex flex-col z-50 fixed w-full h-full items-center justify-center self-center bg-green-500
                }`}
            >
                {' '}
                <Updater />{' '}
            </div>{' '}
        </div>
    )
}
