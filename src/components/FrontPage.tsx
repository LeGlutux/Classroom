import React, { useContext, useRef, useState } from 'react'
import Student from '../components/Student'
import ClassListFilter from '../components/ClassListFilter'
import HomeClassListFilter from '../components/HomeClassListFilter'
import NavBar from './NavBar'
import useOnClickOutside, { useGroups, useStudents } from '../hooks'
import { AuthContext } from '../Auth'
import 'firebase/firestore'
import MagicStick from './MagicStick'
import magicStick from '../images/magicStick.png'
import brain from '../images/brain.png'
import questionMark from '../images/questionMark.png'
import Firebase from '../firebase'

export default () => {
    const db = Firebase.firestore()
    const [withMemory, setWithMemory] = useState(false)
    const [menuOpened, setMenuOpened] = useState<boolean>(false)
    const [burgerMenuFirstClicked, setBurgerMenuFirstClicked] = useState(false)
    const [displayRandomStudent, setDisplayRandomStudent] = useState(false)
    const { currentUser } = useContext(AuthContext)
    if (currentUser === null) return <div />
    const { students, filterStudents } = useStudents(currentUser.uid)
    const { groups } = useGroups(currentUser.uid)
    const [displayedGroup, setDisplayedGroup] = useState('tous')
    const [magicStickStudentsList, setMagicStickStudentsList] = useState(
        students
    )

    const title = displayedGroup === 'tous' ? 'Mes classes' : displayedGroup

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
            <div className="flex flex-row w-full h-12 border-b-2 border-gray-400 items-center font-title font-bold justify-center text-4xl rounded-b-full">
                {title}
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
                </div>
            }
            {displayedGroup !== 'tous' &&
                <button
                    onClick={() => {
                        setMenuOpened(!menuOpened)
                        setBurgerMenuFirstClicked(true)
                        filterStudents(displayedGroup)
                    }}
                    className={`flex flex-col w-16 h-16 bg-gray-200 rounded-full bottom-right-custom2 shadow-custom items-center justify-center ${menuOpened ? 'fade-out' : 'fade-in'} md:w-20 md:h-20}`}
                >
                    <img
                        className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-16 xl:h-16"
                        src={questionMark}
                        alt="" />
                </button>
            }
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
            </div>
            {(groups.length !== 1 && displayedGroup !== 'tous') &&
                <div className="flex flex-row justify-center bg-transparent w-full bottom-center-custom">
                    <ClassListFilter
                        setDisplayedGroup={setDisplayedGroup}
                        onFilter={(group) => {
                            filterStudents(group)
                        }}
                        closeMenu={setMenuOpened}
                        groups={groups}
                    />
                </div>}
            <div className={`w-full h-12 bg-gray-300 table-footer-group`}>
                <NavBar />
            </div>
        </div>
    )
}