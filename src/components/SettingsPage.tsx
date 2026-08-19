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
import openCard from '../images/openCard.png'
import closeCard from '../images/closeCard.png'

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
                <div
                    className={`flex w-full justify-between px-6 settings-page-arrows z-30 bg-transparent`}
                >
                    <button
                        className={`${
                            actualRef === 0 || hide ? 'invisible' : 'visible'
                        }
                    ${groups.length === 0 ? 'invisible' : 'visible'}
                    xl:hidden`}
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
                        className={`${
                            (actualRef === 4 && !adminConnected) ||
                            hide ||
                            actualRef === 5
                                ? 'invisible'
                                : 'visible'
                        }
                    ${groups.length === 0 ? 'invisible' : 'visible'} xl:hidden`}
                        onClick={() => {
                            scrollTo(actualRef + 1)
                            setActualRef(actualRef + 1)
                            setHide(true)
                            setTimeout(() => setHide(false), 400)
                        }}
                    >
                        <img className="w-4" src={openCard} alt="" />
                    </button>
                </div>

                <div
                    className={`flex flex-row flex-1 overflow-x-auto py-8 items-center px-8`}
                    ref={xScroller}
                >
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

                    <div
                        className={`flex ${
                            actualRef === 5 ? 'z-40' : 'z-20'
                        } flex-col mt-2 h-100 w-64 px-12 overflow-visible shadow-custom mx-6 bg-gray-100 pb-4 rounded xl:mt-12 xl:mx-64 ${
                            adminConnected ? 'visible' : 'invisible'
                        }`}
                        ref={ref5}
                    >
                        <div className="flex flex-col h-full justify-around items-center">
                            <div className="flex flex-col h-full justify-around items-center">
                                <div className="settings-title">
                                    Si vous voyez ceci, prévenir le développeur
                                    !
                                </div>
                                <div>
                                    {'version: '} {version}
                                </div>
                                <button
                                    className="flex h-8 w-56 mt-8 self-center bg-green-500 rounded text-white text-lg font-bold justify-center pt-1 mb-5 flex-wrap"
                                    onClick={() =>
                                        updateUsersProps(allUsersIds)
                                    }
                                >
                                    Setup Postits
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full py-3 flex justify-center">
                    <button
                        className="btn-ghost"
                        onClick={() => firebase.auth().signOut()}
                    >
                        Se déconnecter
                    </button>
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
