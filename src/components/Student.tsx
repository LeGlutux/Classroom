import React, { useState, useContext } from 'react'
import alarm from '../images/behaviour.png'
import bookPile from '../images/homework.png'
import schoolBag from '../images/supply.png'
import pen from '../images/observation.png'
import studentLock from '../images/studentLock.png'
import openCard from '../images/openCard.png'
import Firebase from '../firebase'
import { AuthContext } from '../Auth'
import firebase from 'firebase/app'
import { useCross, useRunningPeriode, usePeriodes } from '../hooks'
import { Link } from 'react-router-dom'

interface StudentProps {
    name: string
    surname: string
    classes: string
    id: string
    highlight: boolean
}

export default (props: StudentProps) => {
    const db = Firebase.firestore()
    const { currentUser } = useContext(AuthContext)
    if (currentUser === null) return <div />
    const [highlight, setHighlight] = useState(props.highlight)
    const { periodes } = usePeriodes(currentUser.uid)
    const { runningPeriode } = useRunningPeriode(currentUser.uid)
    const { cross, refreshCross } = useCross(currentUser.uid, props.id)

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
    const handleAddCross = (crossType: string) => {
        if (runningPeriode === periodes.length) {
            db.collection('users')
                .doc(currentUser.uid)
                .collection('eleves')
                .doc(props.id)
                .collection('crosses')
                .doc()
                .set({
                    type: crossType,
                    time: new Date(),
                })
            refreshCross()
        }
    }

    return (
        <div className="flex flex-row w-full xl:w-1/3 items-center iphone-vertical">
            <div className="flex h-full items-center mt-5 ml-2 xl:pt-6">
                <img
                    className={`h-4 w-4 ${
                        runningPeriode === periodes.length
                            ? 'invisible'
                            : 'visible'
                    }`}
                    src={studentLock}
                    alt=""
                />
            </div>
            <div
                className={`rounded mt-5 pb-1 h-32 mx-2 bg-gray-100 w-full shadow-custom ${
                    runningPeriode === periodes.length
                        ? 'bg-gray-100'
                        : 'border-2 border-gray-500'
                }`}
            >
                <div className="flex justify-between flex-col">
                    <div className="flex flex-row overflow-hidden">
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
                            }}
                            className={`flex flex-row lg:flex-row xl:flex:row mt-2 `}
                        >
                            <div
                                className={`font-studentName ml-2 text-gray-900 font-medium xl:text-4xl h-5 ${
                                    highlight ? 'text-red-600' : ''
                                }
                                ${
                                    props.surname.length + props.name.length >
                                    20
                                        ? 'text-xl'
                                        : 'text-3xl'
                                }`}
                            >
                                {props.surname}
                            </div>
                            <div
                                className={`font-studentName ml-2 text-gray-900 xl:text-4xl font-bold ${
                                    highlight ? 'text-red-600' : ''
                                }
                                ${
                                    props.surname.length + props.name.length >
                                    20
                                        ? 'text-xl'
                                        : 'text-3xl'
                                }`}
                            >
                                {props.name}
                            </div>
                        </button>
                    </div>
                    <div className=" w-full h-24 flex p-2 content-center justify-between pr-6">
                        <div className="flex flex-row">
                            <button
                                onClick={() => handleAddCross('behaviour')}
                                className="w-10 h-10 lg:w-12 lg:h-12 xl:w-12 xl:h-12 rounded-full"
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
                                className="w-10 h-10 lg:w-12 lg:h-12 xl:w-12 xl:h-12 rounded-full"
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
                                className="w-10 h-10 lg:w-12 lg:h-12 xl:w-12 xl:h-12 rounded-full"
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
                                className="w-10 h-10 lg:w-12 lg:h-12 xl:w-12 xl:h-12 rounded-full"
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
