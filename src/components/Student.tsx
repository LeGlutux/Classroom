import React, { useState, useContext } from 'react'
import alarm from '../images/behaviour.png'
import bookPile from '../images/homework.png'
import schoolBag from '../images/supply.png'
import pen from '../images/observation.png'
import openCard from '../images/openCard.png'
import Firebase from '../firebase'
import { AuthContext } from '../Auth'
import firebase from 'firebase/app'
import { useCross, useRunningPeriode, usePeriodes } from '../hooks'
import { Link } from 'react-router-dom'
import brain from '../images/brain.png'
import StudentComment from './StudentComment'

interface StudentProps {
    name: string
    surname: string
    classes: string
    id: string
    highlight: boolean
    selected: boolean
    refresher: (group: string) => void
    displayedGroup: string
}

export default (props: StudentProps) => {
    const db = Firebase.firestore()
    const { currentUser } = useContext(AuthContext)
    if (currentUser === null) return <div />
    const [highlight, setHighlight] = useState(props.highlight)
    const { periodes } = usePeriodes(currentUser.uid)
    const { runningPeriode } = useRunningPeriode(currentUser.uid)
    const { cross, refreshCross, loading } = useCross(currentUser.uid, props.id)
    const handleForget = () => {
        db.collection('users')
            .doc(currentUser.uid)
            .collection('eleves')
            .doc(props.id)
            .update({
                selected: false,
            })
        props.refresher(props.displayedGroup)
    }
    const crossFilter = (crossType: string, runningP: number) => {
        if (runningP === periodes.length) {
            const filtered = cross
                .filter(
                    (element: firebase.firestore.DocumentData) =>
                        element.type === crossType
                )
                .filter(
                    (element: firebase.firestore.DocumentData) =>
                        element.time > periodes[runningP - 1]
                )
            return filtered
        } else {
            const filtered = cross
                .filter(
                    (element: firebase.firestore.DocumentData) =>
                        element.type === crossType
                )
                .filter(
                    (element: firebase.firestore.DocumentData) =>
                        element.time > periodes[runningP - 1]
                )
                .filter(
                    (element: firebase.firestore.DocumentData) =>
                        element.time < periodes[runningP]
                )
            return filtered
        }
    }
    const newCrossId = 'c'.concat(Date.now().toString())
    const handleAddCross = (crossType: string) => {
        if (runningPeriode === periodes.length) {
            db.collection('users')
                .doc(currentUser.uid)
                .collection('eleves')
                .doc(props.id)
                .collection('crosses')
                .doc(newCrossId)
                .set({
                    type: crossType,
                    time: new Date(),
                    id: newCrossId,
                })
            refreshCross()
        }
    }

    const shortName =
        (props.name + props.surname).length > 18 && props.surname.length >= 15 ?
            props.name.substring(0, 3).concat('.')
            : (props.name + props.surname).length > 18 && props.surname.length < 15
                ? props.name.substring(0, 17 - props.surname.length).concat('.')
                : props.name



    const shortSurname =
        (shortName + props.surname).length > 16 && props.surname.length > 12
            ? props.surname.substring(0, 8).concat('.')
            : props.surname

    while (loading === true) return <div />

    return (
        <div className="flex flex-row w-full md:w-1/2 lg:w-1/2 xl:w-1/3 items-center">
            <div className="flex h-full items-center mt-5 ml-2 xl:pt-6 static">
                <button
                    className={`h-8 w-8 ${props.selected === false || props.selected === undefined
                        ? 'invisible'
                        : 'visible'
                        }`}
                    onClick={handleForget}
                >
                    <img className="h-8 w-8" src={brain} alt="" />
                </button>
            </div>
            <div
                className={`rounded w-11/12 overflow-hidden ml-2 mt-5 pb-1 mx-2 bg-gray-100 w-full shadow-custom ${runningPeriode === periodes.length
                    ? 'bg-gray-100'
                    : 'border-2 border-gray-500'
                    }`}
            >
                <div className="flex justify-between flex-col">
                    <div className="flex flex-row">
                        <button
                            onClick={() => {
                                db.collection('users')
                                    .doc(currentUser.uid)
                                    .collection('eleves')
                                    .doc(props.id)
                                    .update({
                                        highlight: !highlight,
                                    })
                                setHighlight(!highlight)
                                props.refresher(props.displayedGroup)
                            }}
                            className={`flex flex-row mt-2`}
                        >
                            <div
                                className={`font-studentName ml-2 text-gray-900 font-medium h-5 text-2xl md:text-3xl lg:text-3x xl:text-4xl ${highlight ? 'text-red-600' : ''
                                    }
                                `}
                            >
                                {shortSurname}
                            </div>
                            <div
                                className={`font-studentName ml-2 text-gray-900 font-bold text-2xl md:text-3xl lg:text-3x xl:text-4xl ${highlight ? 'text-red-600' : ''
                                    }`}
                            >
                                {shortName}
                            </div>
                        </button>
                    </div>
                    <div className=" w-full h-12 flex p-2 content-center justify-between pr-6">
                        <div className="flex flex-row">
                            <button
                                onClick={() => handleAddCross('behaviour')}
                                className="w-8 h-8 lg:w-12 lg:h-12 xl:w-12 xl:h-12 rounded-full"
                            >
                                <img className="" src={alarm} alt="" />
                            </button>
                            <div className="font-bold text-black flex text-2xl md:text-3xl lg:text-4xl xl:text-4xl xl:ml-3 xl:pb-8 ">
                                {
                                    crossFilter('behaviour', runningPeriode)
                                        .length
                                }
                            </div>
                        </div>
                        <div className="flex flex-row">
                            <button
                                onClick={() => handleAddCross('homework')}
                                className="w-8 h-8 lg:w-12 lg:h-12 xl:w-12 xl:h-12 rounded-full"
                            >
                                <img className="" src={bookPile} alt="" />
                            </button>
                            <div className="font-bold text-black flex text-2xl md:text-3xl lg:text-4xl xl:text-4xl xl:ml-3 xl:pb-8 ">
                                {crossFilter('homework', runningPeriode).length}
                            </div>
                        </div>
                        <div className="flex flex-row">
                            <button
                                onClick={() => handleAddCross('supply')}
                                className="w-8 h-8 lg:w-12 lg:h-12 xl:w-12 xl:h-12 rounded-full"
                            >
                                <img className="" src={schoolBag} alt="" />
                            </button>
                            <div className="font-bold text-black flex text-2xl md:text-3xl lg:text-4xl xl:text-4xl xl:ml-3 xl:pb-8 ">
                                {crossFilter('supply', runningPeriode).length}
                            </div>
                        </div>
                        <div className="flex flex-row">
                            <button
                                onClick={() => handleAddCross('observation')}
                                className="w-8 h-8 lg:w-12 lg:h-12 xl:w-12 xl:h-12 rounded-full"
                            >
                                <img className="" src={pen} alt="" />
                            </button>
                            <div className="font-bold text-black flex text-2xl md:text-3xl lg:text-4xl xl:text-4xl xl:ml-3 xl:pb-8 ">
                                {
                                    crossFilter('observation', runningPeriode)
                                        .length
                                }
                            </div>
                        </div>
                    </div>
                    <div>
                        <StudentComment
                        currentUserId={currentUser.uid}
                        currentStudentId={props.id}
                        />
                    </div>
                </div>
            </div>

            <Link
                className="flex items-center justify-end mr-6 mt-8"
                to={'/student/'.concat(props.id)}
            >
                <img
                    className="w-4 flex items-center justify-end"
                    src={openCard}
                    alt=""
                />
            </Link>
        </div>
    )
}
