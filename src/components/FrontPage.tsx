import React, { useContext, useEffect, useRef, useState } from 'react'
import firebase from 'firebase/app'
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
import Firebase from '../firebase'
import { Link } from 'react-router-dom'
import Updater from './Updater'
import { handleIcon } from '../functions'
import PostIt from './PostIt'
import { StudentInterface } from '../interfaces/Student'
import PageShell from './PageShell'
import LoadingScreen from './LoadingScreen'

export default () => {
    const db = Firebase.firestore()
    const [withMemory, setWithMemory] = useState(false)
    const lastConnectionUpdateRef = React.useRef<number>(0)
    const [menuOpened, setMenuOpened] = useState<boolean>(false)
    const [burgerMenuFirstClicked, setBurgerMenuFirstClicked] = useState(false)
    const [displayRandomStudent, setDisplayRandomStudent] = useState(false)
    const { currentUser } = useContext(AuthContext)
    if (currentUser === null) return <div />
    const { user, refreshUser } = useUser(currentUser.uid)
    const { students, loading: studentsLoading, filterStudents } = useStudents(currentUser.uid)
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
    const [postItClasse] = useState('none')

    const [displayedGroup, setDisplayedGroup] = useState('tous')
    const [hardStudents, setHardStudents] = useState<StudentInterface[]>([])
    const [magicStickStudentsList, setMagicStickStudentsList] =
        useState(hardStudents)
    const lastFilteredGroupRef = useRef<string>('')

    useEffect(() => {
        setDisplayed(false)
        const timeoutId = setTimeout(() => {
            if (isMountedRef.current) {
                setDisplayed(true)
            }
        }, 2000)
        return () => {
            clearTimeout(timeoutId)
        }
    }, [displayedGroup])

    // Débounce lastConnection update : max 1 fois par minute
    const isMountedRef = useRef(true)
    useEffect(() => {
        isMountedRef.current = true
        
        const now = Date.now()
        const lastUpdate = lastConnectionUpdateRef.current
        const oneMinute = 60 * 1000
        
        // Ne mettre à jour que si plus d'1 minute s'est écoulée
        if (now - lastUpdate > oneMinute) {
            db.collection('users')
                .doc(currentUser.uid)
                .update({ lastConnection: firebase.firestore.FieldValue.serverTimestamp() })
                .then(() => {
                    if (isMountedRef.current) {
                        lastConnectionUpdateRef.current = now
                    }
                })
                .catch(() => {
                    // Ignorer les erreurs silencieusement
                })
        }
        
        return () => {
            isMountedRef.current = false
        }
    }, [currentUser.uid, db])

    // Initialisation : récupérer l'état depuis localStorage
    useEffect(() => {
        const savedGroup = localStorage.getItem('displayedGroup')
        if (savedGroup) {
            setDisplayedGroup(savedGroup)
        } else if (!displayedGroup) {
            setDisplayedGroup('tous')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Sauvegarder dans localStorage quand displayedGroup change
    useEffect(() => {
        if (displayedGroup) {
            localStorage.setItem('displayedGroup', displayedGroup)
        }
    }, [displayedGroup])

    // Automatique : si une seule classe, utiliser celle-ci
    useEffect(() => {
        if (!groupsLoading && Array.isArray(groups) && groups.length === 1 && displayedGroup === 'tous') {
            setDisplayedGroup(groups[0])
        }
    }, [groupsLoading, groups, displayedGroup])

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
        setIconsDisplay(iconsVisualInitialState(userIcons.icons))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userIcons.icons, userIcons.loading])

    // Filtrer les étudiants quand displayedGroup change OU quand les données sont chargées pour la première fois
    useEffect(() => {
        // Éviter de re-filtrer si on a déjà filtré pour ce groupe ou si toujours en chargement
        if (studentsLoading || lastFilteredGroupRef.current === displayedGroup) {
            return
        }
        
        // Filtrer seulement si on a des données
        filterStudents(displayedGroup)
        lastFilteredGroupRef.current = displayedGroup
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [studentsLoading, displayedGroup])
    
    // Mettre à jour hardStudents quand students change (après filtrage)
    useEffect(() => {
        if (students.length > 0) {
            setHardStudents(students)
        }
    }, [students])

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
            <LoadingScreen
                title={title}
                activeMenu="home"
                onHomeClick={handleHomeClick}
            />
        )
    }

    if (groups.length === 0) {
        return (
            <PageShell
                title="Accueil"
                activeMenu="home"
                onHomeClick={handleHomeClick}
                flush
            >
                <div className="empty-state">
                    <p className="empty-state-title">Bienvenue sur Thòt Note</p>
                    <p className="empty-state-text">
                        Commencez par ajouter vos classes et vos élèves dans
                        les réglages.
                    </p>
                    <Link className="btn-primary" to="/create">
                        Configurer l'année
                    </Link>
                </div>
            </PageShell>
        )
    }

    if (groups.length !== 0 && students.length === 0) {
        return (
            <PageShell
                title={title}
                activeMenu="home"
                onHomeClick={handleHomeClick}
                flush
            >
                <div className="empty-state">
                    <p className="empty-state-title">Les classes sont prêtes</p>
                    <p className="empty-state-text">
                        Il ne reste plus qu'à ajouter les élèves.
                    </p>
                    <Link className="btn-primary" to="/create">
                        Ajouter des élèves
                    </Link>
                </div>
            </PageShell>
        )
    }

    if (updating === true) {
        return (
            <LoadingScreen
                standalone
                message="Mise à jour"
            />
        )
    }

    return (
        <div className="app-shell overflow-hidden">
            <Updater
                userId={currentUser.uid}
                userVersion={user?.version || 0}
                refreshUser={refreshUser}
                students={students}
                setUpdating={setUpdating}
                classes={groups}
            />
            {!displayed && displayedGroup !== 'tous' && (
                <div className="modal-overlay" style={{ background: 'rgba(243, 238, 228, 0.92)' }}>
                    <div className="empty-state">
                        <img className="loader-mascot" src={loader_image} alt="" />
                        <p className="empty-state-title">Chargement des données</p>
                    </div>
                </div>
            )}

            <header className="page-header">
                <div className="page-header-side">
                    <span className="period-chip">{'P'.concat(runningPeriode.toString())}</span>
                </div>
                <div className="page-header-main">
                    <h1 className="page-title">{title}</h1>
                </div>
                <div className="page-header-side page-header-side-right">
                    <img
                        alt=""
                        className={`h-7 w-7 ${
                            postIt(displayedGroup) ? 'visible' : 'invisible'
                        }`}
                        src={stickyNoteRed}
                    />
                </div>
            </header>

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
                <div className="student-grid">
                    {students.map(
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
                <div className="flex-1 min-h-0 flex w-full flex-col overflow-hidden py-2">
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
                    className={`flex flex-col w-16 h-16 xl:w-20 xl:h-20 fab-btn rounded-full bottom-right-custom2 items-center justify-center ${
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
                    className={`w-16 h-16 md:w-20 md:h-20 xl:w-20 xl:h-20 fab-btn rounded-full bottom-right-custom flex items-center justify-center ${
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
                    className={`w-16 h-16 md:w-20 md:h-20 xl:w-20 xl:h-20 fab-btn rounded-full bottom-right-custom2 flex items-center justify-center ${
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
                    className={`w-16 h-16 md:w-20 md:h-20 xl:w-20 xl:h-20 fab-btn rounded-full bottom-right-custom3 flex items-center justify-center ${
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

            <NavBar activeMenu="home" onHomeClick={handleHomeClick} />
        </div>
    )
}
