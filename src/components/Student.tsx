import React, { useState, useContext } from 'react'
import alarm from '../images/behaviour.png'
import bookPile from '../images/homework.png'
import schoolBag from '../images/supply.png'
import pen from '../images/observation.png'
import Firebase from '../firebase'
import { AuthContext } from '../Auth'
import firebase from 'firebase/app'
import { useCross, useGroups } from '../hooks'
import DatePicker from 'react-datepicker'

interface StudentProps {
    name: string
    surname: string
    classes: string
}

export default (props: StudentProps) => {
    const [highlight, setHighlight] = useState(false)
    const db = Firebase.firestore()
    const { currentUser } = useContext(AuthContext)
    const currentStudent = props.surname.concat(' ').concat(props.name)
    if (currentUser === null) return <div />

    const { cross, refreshCross } = useCross(currentUser.uid, currentStudent)
    const crossFilter = (crossType: string) =>
        cross.filter(
            (element: firebase.firestore.DocumentData) =>
                element.type === crossType
        )
    const timeStamp = new Date()
    const handleAddCross = (crossType: string) => {
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
        refreshCross()
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
                            {props.surname}
                        </div>
                        <div
                            className={`font-studentName ml-2 text-3xl text-2xl text-gray-900 font-medium font-bold overflow-hidden ${
                                highlight ? 'text-red-600' : ''
                            }`}
                        >
                            {props.name}
                        </div>
                    </button>
                </div>
                <div className=" w-full h-24 flex flex-wrap p-2 content-center justify-between pr-6">
                    <div className="flex flex-row">
                        <button
                            onClick={() => handleAddCross('behaviour')}
                            className="w-12 h-12 rounded-full"
                        >
                            <img className="" src={alarm} alt="" />
                        </button>
                        <div className="font-bold text-black flex text-2xl md:text-3xl lg:text-4xl xl:text-5xl ">
                            {crossFilter('behaviour').length}
                        </div>
                    </div>
                    <div className="flex flex-row">
                        <button
                            onClick={() => handleAddCross('homework')}
                            className="w-12 h-12 rounded-full"
                        >
                            <img className="" src={bookPile} alt="" />
                        </button>
                        <div className="font-bold text-black flex text-2xl md:text-3xl lg:text-4xl xl:text-5xl ">
                            {crossFilter('homework').length}
                        </div>
                    </div>
                    <div className="flex flex-row">
                        <button
                            onClick={() => handleAddCross('supply')}
                            className="w-12 h-12 rounded-full"
                        >
                            <img className="" src={schoolBag} alt="" />
                        </button>
                        <div className="font-bold text-black flex text-2xl md:text-3xl lg:text-4xl xl:text-5xl ">
                            {crossFilter('supply').length}
                        </div>
                    </div>
                    <div className="flex flex-row">
                        <button
                            onClick={() => handleAddCross('observation')}
                            className="w-12 h-12 rounded-full"
                        >
                            <img className="" src={pen} alt="" />
                        </button>
                        <div className="font-bold text-black flex text-2xl md:text-3xl lg:text-4xl xl:text-5xl ">
                            {crossFilter('observation').length}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
