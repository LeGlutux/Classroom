import React, { useContext, useEffect, useRef, useState } from 'react'
import ClassListFilter from '../components/ClassListFilter'
import HomeClassListFilter from '../components/HomeClassListFilter'
import NavBar from './NavBar'
import useOnClickOutside, {
    useGroups,
    useIcons,
    usePeriodes,
    useStudents,
    useUser,
    usePostIts,
} from '../hooks'
import { AuthContext } from '../Auth'
import Student from '../components/Student'
import 'firebase/firestore'
import MagicStick from './MagicStick'
import magicStick from '../images/magicStick.png'
import stickyNoteRed from '../images/stickyNoteRed2.png'
import brain from '../images/brain.png'
import stickyNote from '../images/stickyNote.png'
import burgerMenu from '../images/burgerMenu.png'
import loader_image from '../images/loader.gif'
import updater_gif from '../images/updater.gif'
import addPage from '../images/addPage.png'
import Firebase from '../firebase'
import { Link } from 'react-router-dom'
import Updater from './Updater'
import { handleIcon } from '../functions'
import PostIt from './PostIt'
import { StudentInterface } from '../interfaces/Student'

export default () => {
    const db = Firebase.firestore()
    const [withMemory, setWithMemory] = useState(false)
    const [menuOpened, setMenuOpened] = useState<boolean>(false)
    const [burgerMenuFirstClicked, setBurgerMenuFirstClicked] = useState(false)
    const [displayRandomStudent, setDisplayRandomStudent] = useState(false)
    const { currentUser } = useContext(AuthContext)
    if (currentUser === null) return <div />
    const { user, refreshUser } = useUser(currentUser.uid)
    const { students, loading: studentsLoading } = useStudents(currentUser.uid)
    const { postIts } = usePostIts(currentUser.uid)
    const postIt = (group: string) => {
        if (postIts.find((item) => item.classe === group) === undefined)
            return false
        else
            return postIts.find((item) => item.classe === group)?.content !== ''
    }
    const { groups, loading: groupsLoading } = useGroups(currentUser.uid)
    const { periodes, runningPeriode } = usePeriodes(currentUser.uid)
    const [updating, setUpdating] = useState(false)
    const [displayed, setDisplayed] = useState(false)

    const handleHomeClick = () => {
        setDisplayedGroup('tous')
    }

    const [displayPostIt, setDisplayPostIt] = useState(false)
    const [postItClasse, setPostItClasse] = useState('none')

    const [displayedGroup, setDisplayedGroup] = useState('tous')
    const [hardStudents, setHardStudents] = useState<StudentInterface[]>([])
    const [magicStickStudentsList, setMagicStickStudentsList] =
        useState(hardStudents)

    useEffect(() => {
        setDisplayed(false)
        setTimeout(() => setDisplayed(true), 2000)
    }, [displayedGroup])

    useEffect(() => {
        db.collection('users')
            .doc(currentUser.uid)
            .update({ lastConnection: Date() })
    }, [])

    useEffect(() => {
        if (!studentsLoading && groups.length > 0) {
            setHardStudents(
                students.filter((student) =>
                    displayedGroup === 'tous'
                        ? true
                        : student.classes.includes(displayedGroup)
                )
            )
        }
    }, [studentsLoading, groups, displayedGroup, students])

    const filterStudents = (group: string): StudentInterface[] => {
        const filtered = students
            .filter((student: StudentInterface) =>
                student.classes.includes(group)
            )
            .sort((a: StudentInterface) => (a.highlight ? -1 : 1))
        return filtered
    }

    // automatique du groupe affiché si une seule classe existe
    useEffect(() => {
        if (
            !groupsLoading &&
            Array.isArray(groups) &&
            groups.length === 1 &&
            displayedGroup === 'tous'
        ) {
            setDisplayedGroup(groups[0])
        }
    }, [groupsLoading, groups, displayedGroup])

    useEffect(() => {
        // Récupérer l'état du groupe affiché depuis le localStorage lors du montage
        const savedGroup = localStorage.getItem('displayedGroup')
        if (savedGroup) {
            setDisplayedGroup(savedGroup)
        }
    }, [])

    useEffect(() => {
        // Sauvegarder l'état du groupe affiché dans le localStorage chaque fois qu'il change
        localStorage.setItem('displayedGroup', displayedGroup)
    }, [displayedGroup])

    useEffect(() => {
        if (!displayedGroup) {
            setDisplayedGroup('tous')
        }
    }, [])

    useEffect(() => {
        console.log('groups:', groups)
        console.log('displayedGroup:', displayedGroup)
        if (groups && groups.length === 1 && displayedGroup === 'tous') {
            console.log('Setting displayedGroup to:', groups[0])
            setDisplayedGroup(groups[0])
            filterStudents(groups[0])
        }
    }, [groups, displayedGroup])

    ///////////////// icons /////////////////
    const userIcons = useIcons(currentUser.uid)

    const [icons, setIcons] = useState([1, 2, 3, 4, 0, 0])
    const iconsVisualInitialState = (iconsArray: number[]) => {
        const initialState = [] as string[]
        icons
            ? [0, 1, 2, 3, 4, 5].forEach((i) =>
                  initialState.push(handleIcon(iconsArray[i]))
              )
            : db
                  .collection('users')
                  .doc(currentUser.uid)
                  .update({ icons: [1, 2, 3, 4, 0, 0] })
        return initialState
    }

    const [iconsDisplay, setIconsDisplay] = useState(['none'])

    useEffect(() => {
        setIcons(userIcons.icons)
        setIconsDisplay(iconsVisualInitialState(icons))
    }, [userIcons.icons, userIcons.loading])

    useEffect(() => {
        setHardStudents(filterStudents(displayedGroup))
    }, [studentsLoading, displayedGroup])

    const toggleHighlight = (studentId: string) => {
        hardStudents.forEach((s) => {
            if (s.id === studentId) {
                const index = hardStudents.indexOf(s)
                const student = hardStudents[index]
                Object.defineProperty(student, 'highlight', {
                    value: !student.highlight,
                })
            }
        })
    }

    const toggleSelected = (studentId: string) => {
        hardStudents.forEach((s) => {
            if (s.id === studentId) {
                const index = hardStudents.indexOf(s)
                const student = hardStudents[index]
                const newValue = student.selected ? false : true
                Object.defineProperty(student, 'selected', { value: newValue })
            }
        })
    }

    const title = displayedGroup === 'tous' ? 'Mes classes' : displayedGroup
    const ref = useRef(null)

    const handleClickOutside = () => setMenuOpened(false)
    useOnClickOutside(ref, handleClickOutside)

    const notYetSelectedStudents = hardStudents.filter(
        (student) =>
            student.selected === false || student.selected === undefined
    )

    const checkEmpty = () => {
        if (notYetSelectedStudents.length === 0) {
            hardStudents.forEach((student) => {
                db.collection('users')
                    .doc(currentUser.uid)
                    .collection('eleves')
                    .doc(student.id)
                    .update({
                        selected: false,
                    })
                toggleSelected(student.id)
            })
        }
    }

    if (studentsLoading || groupsLoading) {
        return (
            <div className="w-full h-screen flex flex-col justify-center items-center">
                <div className="flex flex-row w-full h-12 border-b-2 border-gray-400 items-center font-title font-bold justify-center text-4xl rounded-b-full xl:text-6xl xl:h-16">
                    {title}
                </div>
                <div className="h-full flex flex-col justify-center items-center">
                    <div className="font-title text-4xl mb-8 text-bold xl:text-6xl">
                        Chargement des données
                    </div>
                    <div className="w-64 h-64 mt-8 xl:w-64 xl:h-64">
                        <img src={loader_image} alt="" />
                    </div>
                </div>

                <div className={`w-full h-12 bg-gray-300 sticky bottom-0`}>
                    <NavBar activeMenu="home" onHomeClick={handleHomeClick} />
                </div>
            </div>
        )
    }

    if (groups.length === 0) {
        return (
            <div className="w-full h-screen flex flex-col justify-center items-center">
                <div className="flex flex-col w-full h-12 border-b-2 border-gray-400 items-center font-title font-bold justify-center text-4xl rounded-b-full xl:text-6xl xl:h-16">
                    {'Accueil'}
                </div>
                <div className="h-full flex flex-col justify-center items-center">
                    <div className="font-title text-4xl mb-8 text-bold xl:text-6xl">
                        Bienvenue sur Thòt Note
                    </div>
                    <div className="flex w-11/12 justify-center text-center font-title text-3xl mb-8 text-bold xl:text-5xl">
                        Pour commencer à ajouter des classes et des élèves
                        rendez-vous sur :
                    </div>
                    <div className="font-title text-4xl mb-8 text-bold">
                        <Link to="/create">
                            <img className="self-center" src={addPage} alt="" />
                        </Link>{' '}
                    </div>
                </div>

                <div className={`w-full h-12 bg-gray-300 sticky bottom-0`}>
                    <NavBar activeMenu="home" onHomeClick={handleHomeClick} />
                </div>
            </div>
        )
    }

    if (groups.length !== 0 && students.length === 0) {
        return (
            <div className="w-full h-screen flex flex-col justify-center items-center">
                <div className="flex flex-col w-full h-12 border-b-2 border-gray-400 items-center font-title font-bold justify-center text-4xl rounded-b-full">
                    {title}
                </div>

                <div className="h-full flex flex-col justify-center items-center">
                    <div className="flex w-11/12 text-center font-title text-4xl mb-8 text-bold">
                        Les premières classes sont créées, il manque les élèves
                    </div>
                    <div className="flex w-11/12 justify-center font-title text-3xl mb-8 text-bold">
                        rendez-vous sur :
                    </div>
                    <div className="font-title text-4xl mb-8 text-bold">
                        <Link to="/create">
                            <img className="self-center" src={addPage} alt="" />
                        </Link>{' '}
                    </div>
                </div>

                <div className={`w-full h-12 bg-gray-300 sticky bottom-0`}>
                    <NavBar activeMenu="home" onHomeClick={handleHomeClick} />
                </div>
            </div>
        )
    }

    if (updating === true) {
        return (
            <div className="w-full h-screen flex flex-col justify-center items-center">
                <div className="h-full flex flex-col justify-center items-center">
                    <div className="font-title text-4xl mb-8 text-bold">
                        Mise à jour
                    </div>
                    <div className="w-48 h-48 mt-8">
                        <img src={updater_gif} alt="" />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full h-screen flex flex-col">
            <Updater
                userId={currentUser.uid}
                userVersion={user!.version}
                refreshUser={refreshUser}
                students={students}
                setUpdating={setUpdating}
                classes={groups}
            />
            {!displayed && displayedGroup !== 'tous' && (
                <div className="flex flex-col items-center justify-center absolute w-full h-full mb-12 bg-white">
                    <div className="font-title text-4xl mb-8 text-bold xl:text-6xl">
                        Chargement des données
                    </div>
                    <div className="w-64 h-64 mt-8 xl:w-64 xl:h-64">
                        <img src={loader_image} alt="" />
                    </div>
                </div>
            )}

            <div className="flex flex-col w-full absolute top-0 bg-white h-12 border-b-2 p-1 border-gray-400 items-center font-title font-bold justify-around text-4xl rounded-b-full">
                {title}
                <img
                    className={`absolute h-8 w-8 ml-20 mb-1 ${
                        postIt(displayedGroup) ? 'visible' : 'invisible'
                    }`}
                    src={stickyNoteRed}
                />
            </div>

            <div className="flex font-stundentName backdrop-blur bg-transparent rounded-full p-1 px-2 absolute place-self-center mt-12 items-end font-normal text-md">
                {'P'.concat(runningPeriode.toString())}
            </div>

            <MagicStick
                toggleSelected={toggleSelected}
                allStudents={hardStudents}
                students={magicStickStudentsList}
                displayRandomStudent={displayRandomStudent}
                setDisplayRandomStudent={setDisplayRandomStudent}
                withMemory={withMemory}
                onFilter={(group: string) => filterStudents(group)}
                displayedGroup={displayedGroup}
            />
            {postIts.map(({ classe, content }, index) => {
                return (
                    displayedGroup === classe &&
                    displayPostIt && (
                        <PostIt
                            currentUserId={currentUser.uid}
                            classe={classe}
                            content={content}
                            currentClasse={postItClasse}
                            setDisplay={setDisplayPostIt}
                            postIts={postIts}
                            index={index}
                            key={index}
                        />
                    )
                )
            })}

            {displayedGroup !== 'tous' && (
                <div className="flex w-full h-full flex-col pt-18 pb-24 bg-white overflow-y-scroll md:flex-row md:flex-wrap md:content-start lg:flex-row lg:flex-wrap lg:content-start xl:flex-row xl:flex-wrap xl:content-start">
                    {students
                        .sort((a) => (a.highlight ? -1 : 1))
                        .map(
                            ({
                                name,
                                surname,
                                classes,
                                id,
                                selected,
                                highlight,
                                comment,
                            }) => {
                                return (
                                    <Student
                                        displayedStudents={hardStudents}
                                        periodes={periodes}
                                        runningPeriode={runningPeriode}
                                        currentUser={currentUser.uid}
                                        key={id}
                                        loading={studentsLoading}
                                        currentUserId={currentUser.uid}
                                        selected={selected}
                                        classes={classes[0]}
                                        name={name}
                                        surname={surname}
                                        comment={comment ? comment : ''}
                                        id={id}
                                        highlight={highlight}
                                        toggleSelected={toggleSelected}
                                        toggleHighlight={toggleHighlight}
                                        refresher={(group) =>
                                            filterStudents(group)
                                        }
                                        displayedGroup={displayedGroup}
                                        icons={iconsDisplay}
                                    />
                                )
                            }
                        )}
                </div>
            )}

            {displayedGroup === 'tous' && (
                <div className="flex w-full h-full flex-col bg-white overflow-y-scroll justify-around py-2">
                    {
                        <HomeClassListFilter
                            setDisplayedGroup={setDisplayedGroup}
                            onFilter={(group) => {
                                filterStudents(group)
                            }}
                            closeMenu={setMenuOpened}
                            groups={groups}
                            display={postIt}
                        />
                    }
                </div>
            )}

            {displayedGroup !== 'tous' && (
                <button
                    onClick={() => {
                        setMenuOpened(!menuOpened)
                        setBurgerMenuFirstClicked(true)
                        filterStudents(displayedGroup)
                    }}
                    className={`flex flex-col w-16 h-16 xl:w-20 xl:h-20 bg-gray-200 rounded-full bottom-right-custom2 shadow-custom items-center justify-center ${
                        menuOpened ? 'fade-out' : 'fade-in'
                    } md:w-20 md:h-20}`}
                >
                    <img
                        className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-12 xl:h-12"
                        src={burgerMenu}
                        alt=""
                    />
                </button>
            )}
            <div ref={ref}>
                <button
                    onClick={() => {
                        setTimeout(() => setDisplayRandomStudent(true), 200)
                        setWithMemory(false)
                        setMenuOpened(!menuOpened)
                        setMagicStickStudentsList(hardStudents)
                    }}
                    className={`w-16 h-16 md:w-20 md:h-20 xl:w-20 xl:h-20 bg-gray-200 rounded-full bottom-right-custom shadow-custom flex items-center justify-center ${
                        burgerMenuFirstClicked
                            ? menuOpened
                                ? 'entering-r'
                                : 'get-out-r'
                            : 'invisible'
                    }`}
                >
                    <img
                        className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-12 xl:h-12 pb-1"
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
                    className={`w-16 h-16 md:w-20 md:h-20 xl:w-20 xl:h-20 bg-gray-200 rounded-full bottom-right-custom2 shadow-custom flex items-center justify-center ${
                        burgerMenuFirstClicked
                            ? menuOpened
                                ? 'entering-r'
                                : 'get-out-r'
                            : 'invisible'
                    }`}
                >
                    <img
                        className="w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 xl:w-16 xl:h-16"
                        src={brain}
                        alt="élève aléatoire avec mémoire"
                    />
                </button>
                <button
                    onClick={() => {
                        setMenuOpened(!menuOpened)
                        setDisplayPostIt(true)
                    }}
                    className={`w-16 h-16 md:w-20 md:h-20 xl:w-20 xl:h-20 bg-gray-200 rounded-full bottom-right-custom3 shadow-custom flex items-center justify-center ${
                        burgerMenuFirstClicked
                            ? menuOpened
                                ? 'entering-r'
                                : 'get-out-r'
                            : 'invisible'
                    }`}
                >
                    <img
                        className="w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 xl:w-16 xl:h-16"
                        src={stickyNote}
                        alt="pense-bête"
                    />
                </button>
            </div>

            {groups.length !== 1 && displayedGroup !== 'tous' && (
                <div className="flex flex-row justify-start bg-transparent w-full bottom-center-custom">
                    <ClassListFilter
                        setDisplayedGroup={setDisplayedGroup}
                        onFilter={(group) => {
                            filterStudents(group)
                        }}
                        closeMenu={setMenuOpened}
                        groups={groups}
                    />
                </div>
            )}

            <div className={`w-full h-12 bg-gray-300 sticky bottom-0`}>
                <NavBar activeMenu="home" onHomeClick={handleHomeClick} />
            </div>
        </div>
    )
}
