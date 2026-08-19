import React, { useContext, useState } from 'react'
import { useStudent, useGroups, useCross, useIcons } from '../hooks'
import { AuthContext } from '../Auth'
import { useParams, Link, useHistory } from 'react-router-dom'
import closeCard from '../images/closeCard.png'
import firebase from 'firebase/app'
import CrossTab from './CrossTab'
import ConfirmModal from './ConfirmModal'
import edit from '../images/edit.png'
import { handleIcon } from '../functions'

const classToValue = (classes: unknown): string => {
    if (Array.isArray(classes)) {
        return classes[0] ? String(classes[0]) : ''
    }
    if (classes == null) return ''
    return String(classes)
}

const classToLabel = (classes: unknown): string => {
    if (Array.isArray(classes)) {
        return classes.filter(Boolean).join(', ')
    }
    if (classes == null) return ''
    return String(classes)
}

const classesPayload = (current: unknown, next: string) =>
    Array.isArray(current) ? [next] : next

export default () => {
    const { currentUser } = useContext(AuthContext)
    if (currentUser === null) return <div />
    const icons = useIcons(currentUser.uid)
    const { id } = useParams<{ id: string }>()
    if (id === undefined) return <div />
    const [crossRefresher] = useState(0)
    const { cross } = useCross(currentUser.uid, id, crossRefresher)
    const student = useStudent(currentUser.uid, id)
    if (student === undefined) return <div />

    return (
        <View
            currentUser={currentUser}
            crossRefresher={crossRefresher}
            student={student}
            studentId={id}
            cross={cross}
            icons={icons.icons}
        />
    )
}

const View = ({
    currentUser,
    crossRefresher,
    student,
    studentId,
    cross,
    icons,
}: {
    currentUser: firebase.User
    crossRefresher: number
    student: firebase.firestore.DocumentData
    studentId: string
    cross: firebase.firestore.DocumentData[]
    icons: number[]
}) => {
    const { groups } = useGroups(currentUser.uid)
    const crossFilter = (crossType: string) => {
        if (!cross || !Array.isArray(cross)) return []
        const filtered = cross.filter(
            (element: firebase.firestore.DocumentData) =>
                element && element.type === crossType
        )
        const ordered = filtered.sort((a, b) => {
            const timeA = a.time?.toDate ? a.time.toDate().getTime() : (a.time?.getTime ? a.time.getTime() : a.time)
            const timeB = b.time?.toDate ? b.time.toDate().getTime() : (b.time?.getTime ? b.time.getTime() : b.time)
            return timeA < timeB ? 1 : -1
        })
        return ordered
    }
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
    const [displayName, setDisplayName] = useState(student.name)
    const [displaySurname, setDisplaySurname] = useState(student.surname)
    const [displayClasses, setDisplayClasses] = useState(student.classes)
    const currentWeek =
        Math.floor(
            (new Date().getTime() - startDate.getTime()) / (7 * 86400000)
        ) + 1
    const weeks = Array.from({ length: currentWeek }, (_, index) => index + 1)
    const db = firebase.firestore()
    const history = useHistory()

    /////////////////// Notes //////////////////////
    const [editNotes, setEditNotes] = useState(false)
    const [notes, setNotes] = useState(student.notes || '')
    const [notesInputValue, setNotesInputValue] = useState(notes)
    const shortedNotes = (note: string) => {
        const text = note || ''
        const shortNotes =
            text.length >= 60 ? text.substring(0, 56).concat('...') : text
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

    const handleDeletion = () => {
        db.collection('users')
            .doc(currentUser.uid)
            .collection('eleves')
            .doc(studentId)
            .delete()
        history.goBack()
    }

    const openEdition = () => {
        setNameInputValue(String(displayName || ''))
        setSurnameInputValue(String(displaySurname || ''))
        setClassInputValue(classToValue(displayClasses))
        setEditing(true)
    }

    const handleEdition = () => {
        const name = nameInputValue.trim()
        const surname = surnameInputValue.trim()
        const classe = classInputValue.trim()
        if (!name || !surname) {
            alert("Le prénom et le nom sont obligatoires")
            return
        }
        if (!groups.includes(classe)) {
            alert("Cette classe n'existe pas")
            return
        }
        const nextClasses = classesPayload(displayClasses, classe)
        db.collection('users')
            .doc(currentUser.uid)
            .collection('eleves')
            .doc(studentId)
            .set(
                {
                    name,
                    surname,
                    classes: nextClasses,
                },
                { merge: true }
            )
        setDisplayName(name)
        setDisplaySurname(surname)
        setDisplayClasses(nextClasses)
        setEditing(false)
    }

    const classOptions =
        classInputValue && !groups.includes(classInputValue)
            ? [classInputValue, ...groups]
            : groups

    const iconsNumber = icons.indexOf(0) === -1 ? 6 : icons.indexOf(0)

    return (
        <div className="flex flex-col h-screen">
            {editNotes ? (
                <div
                    className="modal-overlay"
                    onClick={() => setEditNotes(false)}
                >
                    <div
                        className="modal-card"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="modal-empty">Notes</div>
                        <label className="modal-field">
                            <span className="modal-label">Commentaire</span>
                            <textarea
                                value={notesInputValue}
                                onChange={(e) =>
                                    setNotesInputValue(e.target.value)
                                }
                                className="modal-textarea"
                                placeholder="Ajouter une note"
                            />
                        </label>
                        <div className="modal-actions">
                            <button
                                type="button"
                                className="modal-btn modal-btn-ghost"
                                onClick={() => setEditNotes(false)}
                            >
                                Annuler
                            </button>
                            <button
                                type="button"
                                className="modal-btn modal-btn-primary"
                                onClick={() => {
                                    confirmAction()
                                    setEditNotes(false)
                                }}
                            >
                                Enregistrer
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}

            {editing ? (
                <div
                    className="modal-overlay"
                    onClick={() => setEditing(false)}
                >
                    <div
                        className="modal-card"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="modal-empty">Modifier l'élève</div>
                        <label className="modal-field">
                            <span className="modal-label">Prénom</span>
                            <input
                                className="modal-input"
                                value={surnameInputValue}
                                onChange={(e) =>
                                    setSurnameInputValue(e.target.value)
                                }
                                type="text"
                            />
                        </label>
                        <label className="modal-field">
                            <span className="modal-label">Nom</span>
                            <input
                                className="modal-input"
                                value={nameInputValue}
                                onChange={(e) =>
                                    setNameInputValue(e.target.value)
                                }
                                type="text"
                            />
                        </label>
                        <label className="modal-field">
                            <span className="modal-label">Classe</span>
                            <select
                                className="modal-select"
                                value={classInputValue}
                                onChange={(e) =>
                                    setClassInputValue(e.target.value)
                                }
                            >
                                {classOptions.length === 0 ? (
                                    <option value="">Aucune classe</option>
                                ) : null}
                                {classOptions.map((group) => (
                                    <option key={group} value={group}>
                                        {group}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <div className="modal-actions">
                            <button
                                type="button"
                                className="modal-btn modal-btn-ghost"
                                onClick={() => setEditing(false)}
                            >
                                Annuler
                            </button>
                            <button
                                type="button"
                                className="modal-btn modal-btn-primary"
                                onClick={handleEdition}
                            >
                                Enregistrer
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}

            <ConfirmModal
                confirm={confirm}
                setConfirm={setConfirm}
                confirmAction={handleDeletion}
                textBox={"Êtes-vous sûr(e) de vouloir supprimer l'élève ?"}
                subTextBox={''}
            />

            <div className="flex flex-col items-center">
                <div className="w-full mt-4 flex items-center px-3">
                    <Link to="/" className="flex items-center justify-center w-8 h-8 flex-shrink-0">
                        <img className="h-6 w-3" src={closeCard} alt="" />
                    </Link>
                    <div className="flex-1 mr-8 flex flex-row items-center justify-center font-studentName text-xl font-semibold leading-tight text-center px-2">
                        {displaySurname} {displayName}
                    </div>
                </div>
                <div className="flex w-full mb-4 justify-center items-center text-sm text-gray-600">
                    {classToLabel(displayClasses)}
                </div>
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
            <div className="flex flex-row justify-start h-10 mx-3">
                <div className="flex flex-col items-center">
                    <div className="font-bold">Notes:</div>
                    <button
                        className="flex h-8 w-8 justify-center items-center"
                        onClick={() => {
                            setNotesInputValue(notes)
                            setEditNotes(true)
                        }}
                    >
                        <img className="h-6 w-6" src={edit} alt="" />
                    </button>
                </div>
                <div className="mx-2">{shortedNotes(notes)}</div>
            </div>
            <div className="student-stats-footer">
                <button
                    type="button"
                    className="student-stats-link"
                    onClick={openEdition}
                >
                    Modifier le nom / la classe
                </button>
                <button
                    type="button"
                    className="student-stats-link student-stats-link-danger"
                    onClick={() => {
                        setConfirm(true)
                    }}
                >
                    Supprimer l'élève
                </button>
            </div>
        </div>
    )
}
