import React, { useContext, useEffect, useRef, useState } from 'react'
import CreateGroups from './Create/CreateGroups'
import CreateStudent from './Create/CreateStudent'
import NavBar from './NavBar'
import LoadingScreen from './LoadingScreen'
import {
    useAllUsersIds,
    useVersion,
    useGroups,
    useLists,
} from '../hooks'
import firebase from 'firebase/app'
import 'react-datepicker/dist/react-datepicker.css'
import { AuthContext } from '../Auth'
import { usePeriodes, useStudents } from '../hooks'
import PeriodeFilter from './PeriodeFilter'
import calendar from '../images/calendar.png'
import ConfirmModal from './ConfirmModal'
import { useHistory } from 'react-router-dom'
import { cards } from '../classes'
import CardCustomer from './CardCustomization/CardCustomer'
import FileUploader from './FileUploader'

export default () => {
    const [confirm, setConfirm] = useState(false)
    const [confirm2, setConfirm2] = useState(false)
    const [saveConfirm, setSaveConfirm] = useState(false)
    const [uploader, setUploader] = useState(true)
    const { currentUser } = useContext(AuthContext)
    const { version } = useVersion()
    if (currentUser === null) return <div />
    const { groups, refreshGroups, loading } = useGroups(currentUser.uid)
    const history = useHistory()
    const { students } = useStudents(currentUser.uid)
    const { periodes, refreshPeriodes, runningPeriode, refreshRunningPeriode } =
        usePeriodes(currentUser.uid)
    const { lists } = useLists(currentUser.uid)
    const db = firebase.firestore()

    const handleHomeClick = () => {
        localStorage.removeItem('displayedGroup')
    }

    const xScroller = useRef<HTMLDivElement>(null)
    const ref0 = useRef<HTMLDivElement>(null)
    const ref1 = useRef<HTMLDivElement>(null)
    const ref2 = useRef<HTMLDivElement>(null)
    const ref3 = useRef<HTMLDivElement>(null)
    const ref4 = useRef<HTMLDivElement>(null)
    const ref5 = useRef<HTMLDivElement>(null)

    const refs = [ref0, ref1, ref2, ref3, ref4, ref5]



    const adminConnected = currentUser.uid === 'yp8DVglUprVCqM8mTmnoZ8cr2yJ3'

    const allUsersIds = useAllUsersIds(currentUser.uid)
    const updateUsersProps = (usersIds: string[]) => {
        // update toutes les props => faire plutôt dans updater
    }

    // Fonction pour lancer une nouvelle version (non utilisée actuellement)
    // const launchNewVersion = () => {
    //     const newVersion = version + 0.1
    //     db.collection('props').doc('app-props').update({ version: newVersion })
    // }

    //////////////////////////// Scrolling ////////////////////////

    const scrollTo = (refN: number) =>
        refs[refN].current?.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
            inline: 'center',
        })
    const [hide, setHide] = useState(false)
    const [actualRef, setActualRef] = useState<number>(0)

    ///////////////////////// Add Periode ////////////////////////

    const handleAddPeriode = () => {
        db.collection('users')
            .doc(currentUser.uid)
            .update({
                periodes: firebase.firestore.FieldValue.arrayUnion(new Date()),
            })
    }

    ///////////////////////// Delete All ////////////////////////

    const handleDeleteAll = () => {
        const batch = db.batch();
    
        // Supprimez toutes les listes associées à chaque élève
        students.forEach((student) => {
            lists.forEach((l) => {
                const listRef = db.collection('users')
                    .doc(currentUser.uid)
                    .collection('eleves')
                    .doc(student.id)
                    .collection('listes')
                    .doc(l.id.concat('s'));
                batch.delete(listRef);
            });
    
            // Supprimez le document de l'élève lui-même
            const studentRef = db.collection('users')
                .doc(currentUser.uid)
                .collection('eleves')
                .doc(student.id);
            batch.delete(studentRef);
        });
    
        // Supprimez toutes les listes
        lists.forEach((l) => {
            const listRef = db.collection('users')
                .doc(currentUser.uid)
                .collection('lists')
                .doc(l.id);
            batch.delete(listRef);
        });
    
        // Appliquez les suppressions en batch
        batch.commit().then(() => {
            // Réinitialisez les classes et périodes après le succès de la suppression
            db.collection('users')
                .doc(currentUser.uid)
                .update({
                    classes: [] as string[],
                    periodes: [new Date()],
                    runningPeriode: 1 as number,
                });
            history.replace('/');
        }).catch((error) => {
            console.error("Erreur lors de la suppression des données: ", error);
        });
    };

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

    const [count, setCount] = useState(0)

    useEffect(() => {
        if (saveConfirm) {
            setCount(1)
        }
        setTimeout(() => {
            setSaveConfirm(false)
        }, 4000)
        setTimeout(() => {
            setCount(0)
        }, 5000)
    }, [saveConfirm])

    const lastCard = adminConnected ? 5 : 4
    const cardCount = lastCard + 1

    if (loading) {
        return (
            <LoadingScreen
                title="Réglages"
                activeMenu="addPage"
                onHomeClick={handleHomeClick}
            />
        )
    } else
        return (
            <div className="app-shell">
                <header className="page-header">
                    <div className="page-header-side" />
                    <div className="page-header-main">
                        <h1 className="page-title">Réglages</h1>
                        <div className="page-subtitle">Paramétrez votre année</div>
                    </div>
                    <div className="page-header-side" />
                </header>
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
                <div className="settings-track">
                    <button
                        type="button"
                        className={`settings-arrow settings-arrow-left ${
                            actualRef === 0 || hide || groups.length === 0
                                ? 'invisible'
                                : ''
                        }`}
                        onClick={() => {
                            scrollTo(actualRef - 1)
                            setActualRef(actualRef - 1)
                            setHide(true)
                            setTimeout(() => setHide(false), 400)
                        }}
                        aria-label="Carte précédente"
                    >
                        <svg viewBox="0 0 20 20">
                            <path d="M12.7 15.3a1 1 0 0 1-1.4 0l-4.6-4.6a1 1 0 0 1 0-1.4l4.6-4.6a1 1 0 1 1 1.4 1.4L8.8 10l3.9 3.9a1 1 0 0 1 0 1.4z" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        className={`settings-arrow settings-arrow-right ${
                            actualRef === lastCard || hide || groups.length === 0
                                ? 'invisible'
                                : ''
                        }`}
                        onClick={() => {
                            scrollTo(actualRef + 1)
                            setActualRef(actualRef + 1)
                            setHide(true)
                            setTimeout(() => setHide(false), 400)
                        }}
                        aria-label="Carte suivante"
                    >
                        <svg viewBox="0 0 20 20">
                            <path d="M7.3 4.7a1 1 0 0 1 1.4 0l4.6 4.6a1 1 0 0 1 0 1.4l-4.6 4.6a1 1 0 1 1-1.4-1.4L11.2 10 7.3 6.1a1 1 0 0 1 0-1.4z" />
                        </svg>
                    </button>

                    <div className="settings-scroller" ref={xScroller}>
                    <div className={cards(0, actualRef)} ref={ref0}>
                        {uploader && (
                            <CreateGroups onAddGroup={refreshGroups} />
                        )}
                        {!uploader && (
                            <FileUploader
                                currentUserId={currentUser.uid}
                                setSaveConfirm={setSaveConfirm}
                            />
                        )}

                        <button
                            className="auth-link self-end mt-3"
                            onClick={() => setUploader(!uploader)}
                        >
                            {!uploader
                                ? 'Ajouter manuellement'
                                : 'Importer depuis Pronote'}
                        </button>
                    </div>

                    <div className={cards(1, actualRef)} ref={ref1}>
                        <CreateStudent
                            groups={groups}
                            currentUserId={currentUser.uid}
                        />
                    </div>

                    <div className={cards(2, actualRef)} ref={ref2}>
                        <CardCustomer
                            userId={currentUser.uid}
                            setSaveConfirm={setSaveConfirm}
                        />
                    </div>

                    <div className={`${cards(3, actualRef)}`} ref={ref3}>
                        <div className="flex flex-col h-full items-center pb-4">
                            <div className="flex flex-col h-full justify-around items-center">
                                <div className="settings-title">
                                    Lancer une nouvelle période
                                </div>

                                <div className="flex flex-row items-center mb-5">
                                    <img
                                        className="w-8 h-8"
                                        src={calendar}
                                        alt=""
                                    />
                                    <div className="text-gray-800 font-studentName text-lg ml-2">
                                        En cours : Période {runningPeriode}
                                    </div>
                                </div>
                                <button
                                    className="btn-primary"
                                    onClick={() => setConfirm(true)}
                                >
                                    {' '}
                                    Commencer une nouvelle période
                                </button>
                                <PeriodeFilter
                                    periodes={periodes}
                                    currentUser={currentUser.uid}
                                    refresh={refreshRunningPeriode}
                                    runningPeriode={runningPeriode}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={cards(4, actualRef)} ref={ref4}>
                        <div className="flex flex-col h-full justify-around items-center">
                            <div className="flex flex-col h-full justify-around items-center">
                                <div className="flex flex-col h-full justify-around items-center">
                                    <div className="settings-title">
                                        L'année est finie ?
                                    </div>
                                    <button
                                        className="btn-danger"
                                        onClick={() => setConfirm2(true)}
                                    >
                                        {' '}
                                        Supprimer toutes les données
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {adminConnected && (
                    <div className={cards(5, actualRef)} ref={ref5}>
                        <div className="flex flex-col h-full justify-around items-center">
                            <div className="settings-title">
                                Si vous voyez ceci, prévenir le développeur
                                !
                            </div>
                            <div>
                                {'version: '} {version}
                            </div>
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={() =>
                                    updateUsersProps(allUsersIds)
                                }
                            >
                                Setup Postits
                            </button>
                        </div>
                    </div>
                    )}
                    </div>
                    <div className="settings-dots">
                        {Array.from({ length: cardCount }).map((_, index) => (
                            <button
                                type="button"
                                key={index}
                                className={`settings-dot ${
                                    actualRef === index ? 'is-active' : ''
                                }`}
                                onClick={() => {
                                    scrollTo(index)
                                    setActualRef(index)
                                }}
                                aria-label={`Aller à la carte ${index + 1}`}
                            />
                        ))}
                    </div>
                    <div className="w-full py-3 flex justify-center">
                        <button
                            className="btn-ghost"
                            type="button"
                            onClick={() => firebase.auth().signOut()}
                        >
                            Se déconnecter
                        </button>
                    </div>
                </div>
                <div
                    className={`toast-success ${
                count !== 0
                    ? saveConfirm
                        ? 'entering-b'
                        : 'fade-out'
                    : 'hidden'
            }`}
                >
                    Les modifications ont été enregistrées
                </div>

                <NavBar activeMenu="addPage" onHomeClick={handleHomeClick} />
            </div>
        )
}
