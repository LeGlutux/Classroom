import React, { useContext, useState } from 'react'
import { useStudent } from '../hooks'
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

export default () => {
    const startDate = new Date('2020-08-31 00:00:01')
    const [confirm, setConfirm] = useState(false)
    const currentWeek =
        Math.floor(
            (new Date().getTime() - startDate.getTime()) / (7 * 86400000)
        ) + 1
    const weeks = Array.from({ length: currentWeek }, (_, index) => index + 1)
    const db = firebase.firestore()
    const { currentUser } = useContext(AuthContext)
    const { id } = useParams()
    if (currentUser === null) return <div />
    if (id === undefined) return <div />
    const student = useStudent(currentUser.uid, id)
    if (student === undefined) return <div />

    const history = useHistory()
    const handleDeleteCross = (crossType: string) => {
        // console.log(cross.filter((element) => element.type === crossType))
    }

    const handleDeletion = () => {
        db.collection('users')
            .doc(currentUser.uid)
            .collection('eleves')
            .doc(id)
            .delete()
        history.goBack()
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

            <div className="w-full text-center mt-4 font-title text-5xl flex items-center">
                <Link to="/">
                    <img className="h-8 w-4 ml-2" src={closeCard} alt="" />
                </Link>
                <div className="w-full mr-4">
                    {student.surname} {student.name}
                </div>
            </div>
            <div className="flex w-full mr-4 justify-center mb-4 font-title2 text-3xl items-center">
                {student.classes}
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
            <div className="flex flex-col text-2xl ml-4 h-82 overflow-y-scroll">
                {weeks.map((elem, index) => {
                    return (
                        <CrossTab
                            studentId={id}
                            userId={currentUser.uid}
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
            <div className="flex flex-row ml-4 mb-4">
                <div className="w-6 text-sm font-bold h-4 my-2" />
                <div className="w-full h-4 flex flex-row justify-evenly my-2 text-xl">
                    <div className="flex flex-row w-full mx-4 items-center justify-center">
                        <button onClick={() => handleDeleteCross('behaviour')}>
                            <img className="h-10 w-10" src={backArrow} alt="" />
                        </button>
                    </div>
                    <div className="flex flex-row w-full mx-4 items-center justify-center">
                        <button onClick={() => handleDeleteCross('homework')}>
                            <img className="h-10 w-10" src={backArrow} alt="" />
                        </button>
                    </div>
                    <div className="flex flex-row w-full mx-4 items-center justify-center">
                        <button onClick={() => handleDeleteCross('supply')}>
                            <img className="h-10 w-10" src={backArrow} alt="" />
                        </button>
                    </div>
                    <div className="flex flex-row w-full mx-4 items-center justify-center">
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
                    className="flex h-8 w-40 self-center mt-6 bg-red-500 rounded text-white text-lg font-bold justify-center"
                >
                    Supprimer l'élève
                </button>
            </div>
        </div>
    )
}
