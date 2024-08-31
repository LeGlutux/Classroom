import React, { useContext, useState } from 'react'
import { useStudent, useGroups, useCross, useIcons } from '../hooks'
import { AuthContext } from '../Auth'
import { useParams, Link, useHistory } from 'react-router-dom'
import closeCard from '../images/closeCard.png'
import firebase from 'firebase/app'
import CrossTab from './CrossTab'
import backArrow from '../images/return.png'
import ConfirmModal from './ConfirmModal'
import edit from '../images/edit.png'
import { handleIcon } from '../functions'

export default () => {
    const { currentUser } = useContext(AuthContext)
    if (currentUser === null) return <div />
    const icons = useIcons(currentUser.uid)
    const { id } = useParams()
    if (id === undefined) return <div />
    const [crossRefresher, setCrossRefresher] = useState(0)
    const { cross } = useCross(currentUser.uid, id, crossRefresher)
    const student = useStudent(currentUser.uid, id)
    if (student === undefined) return <div />

    const crossFilter = (crossType: string) => {
        const filtered = cross.filter(
            (element: firebase.firestore.DocumentData) =>
                element.type === crossType
        )
        const ordered = filtered.sort((a, b) => (a.time < b.time ? 1 : -1))
        return ordered
    }

    return (
        <View
            currentUser={currentUser}
            crossRefresher={crossRefresher}
            setCrossRefresher={setCrossRefresher}
            student={student}
            studentId={id}
            crossFilter={crossFilter}
            icons={icons.icons}
        />
    )
}

const View = ({
    currentUser,
    crossRefresher,
    setCrossRefresher,
    student,
    studentId,
    crossFilter,
    icons,
}: {
    currentUser: firebase.User
    crossRefresher: number
    setCrossRefresher: React.Dispatch<React.SetStateAction<number>>
    student: firebase.firestore.DocumentData
    studentId: string
    crossFilter: (crossType: string) => firebase.firestore.DocumentData[]
    icons: number[]
}) => {
    const { groups } = useGroups(currentUser.uid)
    const getClosestFirstMondayOfSeptember = (): Date => {
        const today = new Date();
        let year = today.getFullYear();
    
        // Crée la date du 1er septembre de l'année en cours
        let septemberFirst = new Date(year, 8, 1);
        
        // Calcule le jour de la semaine pour le 1er septembre
        let dayOfWeek = septemberFirst.getDay();
    
        // Calcule le décalage pour atteindre le premier lundi
        let offset = (8 - dayOfWeek) % 7;
    
        // Ajoute le décalage pour obtenir le premier lundi
        let firstMondayOfSeptember = new Date(septemberFirst.setDate(1 + offset));
    
        // Si le premier lundi est dans le futur, recommence avec l'année précédente
        if (firstMondayOfSeptember > today) {
            septemberFirst = new Date(--year, 8, 1);
            dayOfWeek = septemberFirst.getDay();
            offset = (8 - dayOfWeek) % 7;
            firstMondayOfSeptember = new Date(septemberFirst.setDate(1 + offset));
        }
    
        return firstMondayOfSeptember;
    };
    const startDate = getClosestFirstMondayOfSeptember()
    const [confirm, setConfirm] = useState(false)
    const [editing, setEditing] = useState(false)
    const [nameInputValue, setNameInputValue] = useState('')
    const [surnameInputValue, setSurnameInputValue] = useState('')
    const [classInputValue, setClassInputValue] = useState('')
    const currentWeek =
        Math.floor(
            (new Date().getTime() - startDate.getTime()) / (7 * 86400000)
        ) + 1
    const weeks = Array.from({ length: currentWeek }, (_, index) => index + 1)
    const db = firebase.firestore()
    const history = useHistory()

    /////////////////// Notes //////////////////////
    const [editNotes, setEditNotes] = useState(false)
    const [notes, setNotes] = useState(student.notes)
    const [notesInputValue, setNotesInputValue] = useState(notes)
    const shortedNotes = (note: string) => {
        const shortNotes =
            note.length >= 60 ? note.substring(0, 56).concat('...') : note
        return shortNotes
    }

    const confirmAction = () => {
        db.collection('users')
            .doc(currentUser.uid)
            .collection('eleves')
            .doc(studentId)
            .update({ notes: notesInputValue })
        setNotes(notesInputValue)
    }

    /////////////////////////////////////////////////

    const handleDeleteCross = (crossType: string) => {
        if (crossFilter(crossType).length !== 0) {
            const crossId = crossFilter(crossType)[0].id
            db.collection('users')
                .doc(currentUser.uid)
                .collection('eleves')
                .doc(studentId)
                .collection('crosses')
                .doc(crossId)
                .delete()
            setCrossRefresher(crossRefresher + 1)
        }
    }
    const handleDeletion = () => {
        db.collection('users')
            .doc(currentUser.uid)
            .collection('eleves')
            .doc(studentId)
            .delete()
        history.goBack()
    }

    const handleEdition = () => {
        if (groups.includes(classInputValue)) {
            db.collection('users')
                .doc(currentUser.uid)
                .collection('eleves')
                .doc(studentId)
                .set(
                    {
                        name: nameInputValue,
                        surname: surnameInputValue,
                        classes: classInputValue,
                    },
                    { merge: true }
                )
            history.goBack()
        } else alert("Cette classe n'existe pas")
    }

    const iconsNumber = icons.indexOf(0) === -1 ? 6 : icons.indexOf(0)

    return (
        <div className="flex flex-col h-screen">
            <div
                className={`flex flex-col z-50 w-full h-full items-center justify-center self-center modal-positon ${
                    editNotes ? 'visible' : 'invisible'
                }`}
                style={{ backgroundColor: 'rgba(255,255,255,0.6)' }}
            >
                <div
                    className={`flex flex-col border-black bg-white shadow-lg justify-center items-center w-3/4 h-100 relative ${
                        editNotes ? 'entering-t' : 'invisible'
                    }`}
                >
                    <span className="absolute top-0 right-0 p-4">
                        <svg
                            className="h-4 w-4 fill-current text-grey hover:text-grey-darkest"
                            role="button"
                            onClick={() => setEditNotes(false)}
                        >
                            <title>Close</title>
                            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                        </svg>
                    </span>
                    <textarea
                        value={notesInputValue}
                        onChange={(e) => setNotesInputValue(e.target.value)}
                        className="flex w-10/12 mr-2 mt-10 h-64 z-50 placeholder-gray-700 bg-transparent border-2 border-gray-200 text-lg align-text-top"
                        placeholder={notes}
                    />

                    <div className="flex flex-row w-full justify-around mt-6">
                        <button
                            className="bg-red-700 rounded-lg font-bold w-24 h-12 lg:w-32 lg:h-12 xl:w-40 xl:h-16 shadow-xl font-studentName sm:text-lg md:text-xl lg:text-2xl xl:text-3xl"
                            onClick={() => {
                                setEditNotes(false)
                            }}
                        >
                            Annuler
                        </button>
                        <button
                            className="bg-green-700 rounded-lg font-bold w-24 h-12 lg:w-32 lg:h-12 xl:w-40 xl:h-16 shadow-xl font-studentName sm:text-lg md:text-xl lg:text-2xl xl:text-3xl"
                            onClick={() => {
                                confirmAction()
                                setEditNotes(false)
                            }}
                        >
                            Confirmer
                        </button>
                    </div>
                </div>
            </div>

            <ConfirmModal
                confirm={confirm}
                setConfirm={setConfirm}
                confirmAction={handleDeletion}
                textBox={"Êtes-vous sûr(e) de vouloir supprimer l'élève ?"}
                subTextBox={''}
            />

            <div
                className={`flex flex-col items-center z-50 absolute w-full ${
                    editing ? 'visible' : 'invisible'
                }`}
            >
                <div
                    className={`w-full text-center mt-4 font-title text-5xl flex items-center`}
                >
                    <Link to="/">
                        <img className="h-8 w-4 ml-2" src={closeCard} alt="" />
                    </Link>
                    <div className="w-full mr-4 flex flex-row items-baseline justify-center text-4xl">
                        <input
                            value={surnameInputValue}
                            onChange={(e) =>
                                setSurnameInputValue(e.target.value)
                            }
                            className="h-10 w-32 mt-3 placeholder-gray-700 ml-5 bg-transparent border-b-2 border-gray-600 text-2xl text-center"
                            type="text"
                            placeholder={student.surname}
                        />
                        <input
                            className="h-10 w-32 mt-3 placeholder-gray-700 text-2xl ml-5 bg-transparent border-b-2 border-gray-600 text-center"
                            value={nameInputValue}
                            onChange={(e) => setNameInputValue(e.target.value)}
                            type="text"
                            placeholder={student.name}
                        />
                    </div>
                </div>
                <div
                    className={`flex w-full px-8 justify-between mb-4 font-title2 text-3xl items-center `}
                >
                    <button
                        className="bg-red-700 rounded-lg font-bold w-24 h-8 text-sm lg:w-32 lg:h-12 xl:w-40 xl:h-16 shadow-xl font-studentName sm:text-lg md:text-xl lg:text-2xl xl:text-3xl"
                        onClick={() => {
                            setEditing(false)
                        }}
                    >
                        Annuler
                    </button>
                    <input
                        className="h-10 w-20 mt-3 placeholder-gray-700 text-lg bg-transparent border-b-2 border-gray-600 text-center"
                        value={classInputValue}
                        onChange={(e) => setClassInputValue(e.target.value)}
                        type="text"
                        placeholder={student.classes}
                    />
                    <button
                        className="bg-green-700 rounded-lg font-bold w-24 h-8 text-sm lg:w-32 lg:h-12 xl:w-40 xl:h-16 shadow-xl font-studentName sm:text-lg md:text-xl lg:text-2xl xl:text-3xl"
                        onClick={() => {
                            handleEdition()
                            setEditing(false)
                        }}
                    >
                        Confirmer
                    </button>
                </div>
            </div>

            <div
                className={`flex flex-col items-center ${
                    editing ? 'invisible' : 'visible'
                }`}
            >
                <div
                    className={`w-full text-center mt-4 font-title text-5xl flex items-center`}
                >
                    <Link to="/">
                        <img className="h-8 w-4 ml-2" src={closeCard} alt="" />
                    </Link>
                    <div className="w-full mr-4 flex flex-row items-baseline justify-center text-4xl">
                        {student.surname} {student.name}
                    </div>
                </div>
                <div
                    className={`flex w-full mb-4 mr-4 justify-center font-title2 text-3xl items-center `}
                >
                    {student.classes}
                </div>
                <button
                    className="h-6 w-6 mr-4 absolute top-10 right-10"
                    onClick={() => {
                        setEditing(true)
                        setNameInputValue(student.name.toString())
                        setSurnameInputValue(student.surname.toString())
                        setClassInputValue(student.classes.toString())
                    }}
                >
                    <img src={edit} alt="modifier" />
                </button>
            </div>

            <div className="flex flex-row ml-4 mb-4">
                <div className="w-4 text-sm font-bold h-4 my-2">S</div>
                <div className="w-full h-4 flex flex-row justify-evenly my-2 text-xl">
                    <div
                        className={`flex flex-row w-full mx-4 items-center justify-center ${
                            icons[0] === 0 ? 'hidden' : 'visible'
                        } `}
                    >
                        <img
                            className="h-6 w-6"
                            src={handleIcon(icons[0])}
                            alt=""
                        />
                    </div>
                    <div
                        className={`flex flex-row w-full mx-4 items-center justify-center ${
                            icons[1] === 0 ? 'hidden' : 'visible'
                        } `}
                    >
                        <img
                            className="h-6 w-6"
                            src={handleIcon(icons[1])}
                            alt=""
                        />
                    </div>
                    <div
                        className={`flex flex-row w-full mx-4 items-center justify-center ${
                            icons[2] === 0 ? 'hidden' : 'visible'
                        } `}
                    >
                        <img
                            className="h-6 w-6"
                            src={handleIcon(icons[2])}
                            alt=""
                        />
                    </div>
                    <div
                        className={`flex flex-row w-full mx-4 items-center justify-center ${
                            icons[3] === 0 ? 'hidden' : 'visible'
                        } `}
                    >
                        <img
                            className="h-6 w-6"
                            src={handleIcon(icons[3])}
                            alt=""
                        />
                    </div>
                    <div
                        className={`flex flex-row w-full mx-4 items-center justify-center ${
                            icons[4] === 0 ? 'hidden' : 'visible'
                        } `}
                    >
                        <img
                            className="h-6 w-6"
                            src={handleIcon(icons[4])}
                            alt=""
                        />
                    </div>
                    <div
                        className={`flex flex-row w-full mx-4 items-center justify-center ${
                            icons[5] === 0 ? 'hidden' : 'visible'
                        } `}
                    >
                        <img
                            className="h-6 w-6"
                            src={handleIcon(icons[5])}
                            alt=""
                        />
                    </div>
                </div>
            </div>
            <div className="flex flex-col text-2xl h-82 ml-4 overflow-y-scroll">
                {weeks.map((elem, index) => {
                    return (
                        <CrossTab
                            studentId={studentId}
                            userId={currentUser.uid}
                            crossRefresher={crossRefresher}
                            week={
                                startDate.getTime() +
                                (weeks.length - index - 1) * 7 * 86400000
                            }
                            index={weeks.length - index}
                            key={index}
                            iconsNumber={icons.indexOf(0)}
                        />
                    )
                })}
            </div>
            <div className="flex flex-row ml-4 mb-2">
                <div className="w-6 text-sm font-bold h-4 my-2" />
                <div className="w-full h-4 flex flex-row justify-evenly my-2 text-xl">
                    <div
                        className={`flex flex-row w-full mx-4 items-center justify-center ${
                            iconsNumber < 1 ? 'hidden' : 'visible'
                        }`}
                    >
                        {crossFilter('behaviour').length}
                    </div>
                    <div
                        className={`flex flex-row w-full mx-4 items-center justify-center ${
                            iconsNumber < 2 ? 'hidden' : 'visible'
                        }`}
                    >
                        {crossFilter('homework').length}
                    </div>
                    <div
                        className={`flex flex-row w-full mx-4 items-center justify-center ${
                            iconsNumber < 3 ? 'hidden' : 'visible'
                        }`}
                    >
                        {crossFilter('supply').length}
                    </div>
                    <div
                        className={`flex flex-row w-full mx-4 items-center justify-center ${
                            iconsNumber < 4 ? 'hidden' : 'visible'
                        }`}
                    >
                        {crossFilter('observation').length}
                    </div>
                    <div
                        className={`flex flex-row w-full mx-4 items-center justify-center ${
                            iconsNumber < 5 ? 'hidden' : 'visible'
                        }`}
                    >
                        {crossFilter('calculator').length}
                    </div>
                    <div
                        className={`flex flex-row w-full mx-4 items-center justify-center ${
                            iconsNumber < 6 ? 'hidden' : 'visible'
                        }`}
                    >
                        {crossFilter('phone').length}
                    </div>
                </div>
            </div>
            <div className="flex flex-row ml-4 mb-2">
                <div className="w-6 text-sm font-bold h-4 my-2" />
                <div className="w-full h-4 flex flex-row justify-evenly my-2 text-xl">
                    <div
                        className={`flex flex-row w-full mx-4 items-center justify-center ${
                            iconsNumber < 1 ? 'hidden' : 'visible'
                        }`}
                    >
                        <button
                            onClick={() => {
                                handleDeleteCross('behaviour')
                            }}
                        >
                            <img className="h-8 w-8" src={backArrow} alt="" />
                        </button>
                    </div>
                    <div
                        className={`flex flex-row w-full mx-4 items-center justify-center ${
                            iconsNumber < 2 ? 'hidden' : 'visible'
                        }`}
                    >
                        <button
                            onClick={() => {
                                handleDeleteCross('homework')
                            }}
                        >
                            <img className="h-8 w-8" src={backArrow} alt="" />
                        </button>
                    </div>
                    <div
                        className={`flex flex-row w-full mx-4 items-center justify-center ${
                            iconsNumber < 3 ? 'hidden' : 'visible'
                        }`}
                    >
                        <button onClick={() => handleDeleteCross('supply')}>
                            <img className="h-8 w-8" src={backArrow} alt="" />
                        </button>
                    </div>
                    <div
                        className={`flex flex-row w-full mx-4 items-center justify-center ${
                            iconsNumber < 4 ? 'hidden' : 'visible'
                        }`}
                    >
                        <button
                            onClick={() => handleDeleteCross('observation')}
                        >
                            <img className="h-8 w-8" src={backArrow} alt="" />
                        </button>
                    </div>
                    <div
                        className={`flex flex-row w-full mx-4 items-center justify-center ${
                            iconsNumber < 5 ? 'hidden' : 'visible'
                        }`}
                    >
                        <button
                            onClick={() => {
                                handleDeleteCross('calculator')
                            }}
                        >
                            <img className="h-8 w-8" src={backArrow} alt="" />
                        </button>
                    </div>
                    <div
                        className={`flex flex-row w-full mx-4 items-center justify-center ${
                            iconsNumber < 6 ? 'hidden' : 'visible'
                        }`}
                    >
                        <button
                            onClick={() => {
                                handleDeleteCross('phone')
                            }}
                        >
                            <img className="h-8 w-8" src={backArrow} alt="" />
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex flex-row justify-start h-10 mx-3">
                <div className="flex flex-col items-center">
                    <div className="font-bold">Notes:</div>
                    <button
                        className="flex h-8 w-8 justify-center items-center"
                        onClick={() => {
                            setEditNotes(true)
                        }}
                    >
                        <img className="h-6 w-6" src={edit} alt="" />
                    </button>
                </div>
                <div className="mx-2">{shortedNotes(notes)}</div>
            </div>
            <div className="flex items-center justify-center">
                <button
                    onClick={() => {
                        setConfirm(true)
                    }}
                    className="flex h-4 w-32 self-center mt-2 text-red-500 text-sm justify-center"
                >
                    Supprimer l'élève
                </button>
            </div>
        </div>
    )
}
