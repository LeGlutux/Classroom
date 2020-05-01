import React, { useState, useContext } from 'react'
import alarm from '../images/behaviour.png'
import bookPile from '../images/homework.png'
import schoolBag from '../images/supply.png'
import pen from '../images/observation.png'
import Firebase from '../firebase'
import { AuthContext } from '../Auth'
import firebase from 'firebase/app'
import { useCross, useGroups } from '../hooks'

interface StudentProps {
    name: string
    surname: string
    avatar: string
    classe: string
}

export default (props: StudentProps) => {
    const [highlight, setHighlight] = useState(false)
    const db = Firebase.firestore()
    const { currentUser } = useContext(AuthContext)
    const currentStudent = props.surname.concat(' ').concat(props.name)
    if (currentUser === null) return <div />

    const { cross: behaviour, refreshCross: refreshBehaviour } = useCross(
        currentUser.uid,
        currentStudent,
        'behaviour'
    )

    const { cross: homework, refreshCross: refreshHomework } = useCross(
        currentUser.uid,
        currentStudent,
        'homework'
    )

    const { cross: supply, refreshCross: refreshSupply } = useCross(
        currentUser.uid,
        currentStudent,
        'supply'
    )

    const { cross: observation, refreshCross: refreshObservation } = useCross(
        currentUser.uid,
        currentStudent,
        'observation'
    )

    const timeStamp = firebase.firestore.FieldValue.serverTimestamp()
    const handleAddCross = (
        crossType: string,
        refresh: () => Promise<void>
    ) => {
        db.collection('users')
            .doc(currentUser.uid)
            .collection('eleves')
            .doc(currentStudent)
            .collection('crosses')
            .doc()
            .set({
                type: crossType,
                time: timeStamp,
            })
        refresh()
    }

    if (
        behaviour === undefined ||
        homework === undefined ||
        supply === undefined ||
        observation === undefined
    ) {
        return <div />
    }

    return (
        <div className="rounded mt-5 pb-1 h-32 mx-6 bg-gray-100 shadow-custom">
            <div className="flex justify-between flex-col">
                <div className="flex flex-row">
                    <button
                        onClick={() => {
                            setHighlight(!highlight)
                        }}
                        className={`flex flex-row lg:flex-row xl:flex:row mt-2 `}
                    >
                        <div
                            className={`font-studentName ml-2 text-3xl text-gray-900 font-medium h-5 ${
                                highlight ? 'text-red-600' : ''
                            }`}
                        >
                            {props.name}
                        </div>
                        <div
                            className={`font-studentName ml-2 text-3xl text-2xl text-gray-900 font-medium font-bold overflow-hidden ${
                                highlight ? 'text-red-600' : ''
                            }`}
                        >
                            {props.surname}
                        </div>
                    </button>
                </div>
                <div className=" w-full h-24 flex flex-wrap p-2 content-center justify-between pr-6">
                    <div className="flex flex-row">
                        <button
                            onClick={() =>
                                handleAddCross('behaviour', refreshBehaviour)
                            }
                            className="w-12 h-12 rounded-full"
                        >
                            <img className="" src={alarm} alt="" />
                        </button>
                        <div className="font-bold text-black flex text-2xl md:text-3xl lg:text-4xl xl:text-5xl ">
                            {behaviour.length}
                        </div>
                    </div>
                    <div className="flex flex-row">
                        <button
                            onClick={() =>
                                handleAddCross('homework', refreshHomework)
                            }
                            className="w-12 h-12 rounded-full"
                        >
                            <img className="" src={bookPile} alt="" />
                        </button>
                        <div className="font-bold text-black flex text-2xl md:text-3xl lg:text-4xl xl:text-5xl ">
                            {homework.length}
                        </div>
                    </div>
                    <div className="flex flex-row">
                        <button
                            onClick={() =>
                                handleAddCross('supply', refreshSupply)
                            }
                            className="w-12 h-12 rounded-full"
                        >
                            <img className="" src={schoolBag} alt="" />
                        </button>
                        <div className="font-bold text-black flex text-2xl md:text-3xl lg:text-4xl xl:text-5xl ">
                            {supply.length}
                        </div>
                    </div>
                    <div className="flex flex-row">
                        <button
                            onClick={() =>
                                handleAddCross(
                                    'observation',
                                    refreshObservation
                                )
                            }
                            className="w-12 h-12 rounded-full"
                        >
                            <img className="" src={pen} alt="" />
                        </button>
                        <div className="font-bold text-black flex text-2xl md:text-3xl lg:text-4xl xl:text-5xl ">
                            {observation.length}
                        </div>
                        <div>{observation.for}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
