import React, { useContext, useState } from 'react'
import { useStudent, useGroups, useCross } from '../hooks'
import { AuthContext } from '../Auth'
import { useParams, Link, useHistory } from 'react-router-dom'
import closeCard from '../images/closeCard.png'
import firebase from 'firebase/app'
import CrossTab from './CrossTab'
import alarm from '../images/behaviour.png'
import bookPile from '../images/homework.png'
import schoolBag from '../images/supply.png'
import pen from '../images/observation.png'
import backArrow from '../images/return.png'
import ConfirmModal from './ConfirmModal'
import edit from '../images/edit.png'

export default () => {
    const { currentUser } = useContext(AuthContext)
    if (currentUser === null) return <div />
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
}: {
    currentUser: firebase.User
    crossRefresher: number
    setCrossRefresher: React.Dispatch<React.SetStateAction<number>>
    student: firebase.firestore.DocumentData
    studentId: string
    crossFilter: (crossType: string) => firebase.firestore.DocumentData[]
}) => {
    const { groups } = useGroups(currentUser.uid)
    const startDate = new Date('2021-08-30 00:00:01')
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
        }
    }

    return (
        <div className="flex flex-col">
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
                    className={`flex w-full mb-8 mr-4 justify-center font-title2 text-3xl items-center `}
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
                <div className="w-6 text-sm font-bold h-4 my-2">Sem</div>
                <div className="w-full h-4 flex flex-row justify-evenly my-2 text-xl">
                    <div className="flex flex-row w-full mx-4 items-center justify-center">
                        <img className="h-10 w-10" src={alarm} alt="" />
                    </div>
                    <div className="flex flex-row w-full mx-4 items-center justify-center">
                        <img className="h-10 w-10" src={bookPile} alt="" />
                    </div>
                    <div className="flex flex-row w-full mx-4 items-center justify-center">
                        <img className="h-10 w-10" src={schoolBag} alt="" />
                    </div>
                    <div className="flex flex-row w-full mx-4 items-center justify-center">
                        <img className="h-10 w-10" src={pen} alt="" />
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
                        />
                    )
                })}
            </div>
            <div className="flex flex-row ml-4 mb-2">
                <div className="w-6 text-sm font-bold h-4 my-2" />
                <div className="w-full h-4 flex flex-row justify-evenly my-2 text-xl">
                    <div className="flex flex-row w-full mx-4 items-center justify-center">
                        {crossFilter('behaviour').length}
                    </div>
                    <div className="flex flex-row w-full mx-4 items-center justify-center">
                        {crossFilter('homework').length}
                    </div>
                    <div className="flex flex-row w-full mx-4 items-center justify-center">
                        {crossFilter('supply').length}
                    </div>
                    <div className="flex flex-row w-full mx-4 items-center justify-center">
                        {crossFilter('observation').length}
                    </div>
                </div>
            </div>
            <div className="flex flex-row ml-4 mb-2">
                <div className="w-6 text-sm font-bold h-4 my-2" />
                <div className="w-full h-4 flex flex-row justify-evenly my-2 text-xl">
                    <div
                        className={`flex flex-row w-full mx-4 items-center justify-center `}
                    >
                        <button
                            onClick={() => {
                                handleDeleteCross('behaviour')
                            }}
                        >
                            <img className="h-10 w-10" src={backArrow} alt="" />
                        </button>
                    </div>
                    <div
                        className={`flex flex-row w-full mx-4 items-center justify-center`}
                    >
                        <button
                            onClick={() => {
                                handleDeleteCross('homework')
                            }}
                        >
                            <img className="h-10 w-10" src={backArrow} alt="" />
                        </button>
                    </div>
                    <div
                        className={`flex flex-row w-full mx-4 items-center justify-center `}
                    >
                        <button onClick={() => handleDeleteCross('supply')}>
                            <img className="h-10 w-10" src={backArrow} alt="" />
                        </button>
                    </div>
                    <div
                        className={`flex flex-row w-full mx-4 items-center justify-center `}
                    >
                        <button
                            onClick={() => handleDeleteCross('observation')}
                        >
                            <img className="h-10 w-10" src={backArrow} alt="" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-center">
                <button
                    onClick={() => {
                        setConfirm(true)
                    }}
                    className="flex h-8 w-40 self-center mt-2 bg-red-500 rounded text-white text-lg font-bold justify-center"
                >
                    Supprimer l'élève
                </button>
            </div>
        </div>
    )
}
