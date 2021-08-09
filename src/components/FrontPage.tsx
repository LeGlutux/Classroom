import React, { useContext, useRef, useState } from 'react'
import Student from '../components/Student'
import ClassListFilter from '../components/ClassListFilter'
import HomeClassListFilter from '../components/HomeClassListFilter'
import NavBar from './NavBar'
import useOnClickOutside, { useGroups, useStudents, useRunningPeriode } from '../hooks'
import { AuthContext } from '../Auth'
import 'firebase/firestore'
import MagicStick from './MagicStick'
import magicStick from '../images/magicStick.png'
import burgerMenu from '../images/burgerMenu.png'
import brain from '../images/brain.png'
import Firebase from '../firebase'

export default () => {
    const db = Firebase.firestore()
    const [withMemory, setWithMemory] = useState(false)
    const [menuOpened, setMenuOpened] = useState<boolean>(false)
    const [burgerMenuFirstClicked, setBurgerMenuFirstClicked] = useState(false)
    const [displayRandomStudent, setDisplayRandomStudent] = useState(false)
    const { currentUser } = useContext(AuthContext)
    if (currentUser === null) return <div />
    const { students, filterStudents, refreshStudents } = useStudents(currentUser.uid)
    const { groups } = useGroups(currentUser.uid)
    const [displayedGroup, setDisplayedGroup] = useState('tous')
    const { runningPeriode } = useRunningPeriode(currentUser.uid)
    const [magicStickStudentsList, setMagicStickStudentsList] = useState(
        students
    )

    const ref = useRef(null)
    const handleClickOutside = () => setMenuOpened(false)
    useOnClickOutside(ref, handleClickOutside)

    if (groups.length === 1 && displayedGroup === 'tous') {
        setDisplayedGroup(groups[0])
        filterStudents(groups[0])
    }
    const notYetSelectedStudents = students.filter(
        (student) =>
            student.selected === false || student.selected === undefined
    )
    const checkEmpty = () => {
        if (notYetSelectedStudents.length === 0) {
            students.forEach((student) => {
                db.collection('users')
                    .doc(currentUser.uid)
                    .collection('eleves')
                    .doc(student.id)
                    .update({
                        selected: false,
                    })
            })
        }
    }

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
                    className={`rounded-lg bg-white font-studentName font-bold px-6 ${displayedGroup.length > 8
                            ? 'text-sm overflow-hidden mt-3 h-16'
                            : 'text-2xl mt-20'
                        }
                    ${displayedGroup === 'tous' ? 'invisible' : 'visible'}`}
                    style={{ backgroundColor: 'rgba(255,255,255,0.6)' }}
                >
                    {displayedGroup}
                </div>
            </div>
            <MagicStick
                allStudents={students}
                students={magicStickStudentsList}
                displayRandomStudent={displayRandomStudent}
                setDisplayRandomStudent={setDisplayRandomStudent}
                withMemory={withMemory}
                onFilter={(group: string) => filterStudents(group)}
                displayedGroup={displayedGroup}
            />
            {displayedGroup !== 'tous' &&
                <div className="flex w-full h-full flex-col bg-white overflow-y-scroll md:flex-row md:flex-wrap md:content-start lg:flex-row lg:flex-wrap lg:content-start xl:flex-row xl:flex-wrap xl:content-start">
                    {
                        students
                            .map(
                                ({
                                    name,
                                    surname,
                                    classes,
                                    id,
                                    selected,
                                    highlight,
                                }) => {
                                    return (
                                        <Student
                                            key={id}
                                            selected={selected}
                                            classes={classes}
                                            name={name}
                                            surname={surname}
                                            id={id}
                                            highlight={highlight}
                                            refresher={(group) => filterStudents(group)}
                                            displayedGroup={displayedGroup}
                                        />
                                    )
                                }
                            )}
                </div>}

            {displayedGroup === 'tous' &&
                <div className="flex w-full h-full flex-col bg-white overflow-y-scroll justify-around">
                    {
                        <HomeClassListFilter
                            setDisplayedGroup={setDisplayedGroup}
                            onFilter={(group) => {
                                filterStudents(group)
                            }}
                            closeMenu={setMenuOpened}
                            groups={groups}
                        />
                    }
                </div>}

            <div className={`w-full h-12 bg-gray-300 table-footer-group ${(displayedGroup === 'tous') ? 'invisible' : 'visible'}`}>
                <div className="ml-3 pt-2 font-bold text-xl flex justify-between align-top">
                    <div className="overflow-x-scroll">
                        <ClassListFilter
                            setDisplayedGroup={setDisplayedGroup}
                            onFilter={(group) => {
                                filterStudents(group)
                            }}
                            closeMenu={setMenuOpened}
                            groups={groups}
                        />
                    </div>
                    <div
                    ref={ref}
                    >

                        <button
                            onClick={() => {
                                setTimeout(() => setDisplayRandomStudent(true), 200)
                                setWithMemory(false)
                                setMenuOpened(!menuOpened)
                                setMagicStickStudentsList(students)
                            }}
                            className={`w-16 h-16 md:w-20 md:h-20 bg-gray-200 rounded-full bottom-right-custom shadow-custom flex items-center justify-center ${burgerMenuFirstClicked ? (menuOpened ? 'entering-r' : 'get-out-r') : 'invisible'
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
                                checkEmpty()
                                setWithMemory(true)
                                setMenuOpened(!menuOpened)
                                setMagicStickStudentsList(notYetSelectedStudents)
                                setTimeout(() => setDisplayRandomStudent(true), 200)
                            }}
                            className={`w-16 h-16 md:w-20 md:h-20 bg-gray-200 rounded-full bottom-right-custom2 shadow-custom flex items-center justify-center ${burgerMenuFirstClicked ? (menuOpened ? 'entering-r' : 'get-out-r') : 'invisible'
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
                            setBurgerMenuFirstClicked(true)
                            filterStudents(displayedGroup)
                        }}
                        className={`mr-6 w-8 h-8 text-gray-700 rounded`}
                    >
                        <img src={burgerMenu} alt="" />
                    </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
