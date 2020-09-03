import React, { useContext } from 'react'
import alarm from '../images/behaviour.png'
import bookPile from '../images/homework.png'
import schoolBag from '../images/supply.png'
import pen from '../images/observation.png'
import { AuthContext } from '../Auth'
import firebase from 'firebase/app'
import { useCross, useRunningPeriode, usePeriodes } from '../hooks'

interface StudentProps {
    name: string
    surname: string
    classes: string
    id: string
}

export default (props: StudentProps) => {
    const { currentUser } = useContext(AuthContext)
    if (currentUser === null) return <div />
    const { periodes } = usePeriodes(currentUser.uid)
    const { runningPeriode } = useRunningPeriode(currentUser.uid)
    const { cross } = useCross(currentUser.uid, props.id)

    const crossFilter = (crossType: string, runningP: number) => {
        const filtered = cross
            .filter(
                (element: firebase.firestore.DocumentData) =>
                    element.type === crossType
            )
            .filter(
                (element: firebase.firestore.DocumentData) =>
                    element.time > periodes[periodes.length - 1]
            )
        return filtered
    }

    return (
        <div className="flex flex-col w-full xl:w-1/3 items-center justify-between h-full">
            <div className={`rounded mt-5 pb-1 mx-2 bg-gray-100 w-full h-full`}>
                <div className="flex justify-between flex-col h-full">
                    <div
                        className={`font-studentName ml-2 text-gray-900 font-medium xl:text-4xl h-8 pt-3
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
                        className={`font-studentName ml-2 text-gray-900 xl:text-4xl font-bold h-8 p-3
                                ${
                                    props.surname.length + props.name.length >
                                    20
                                        ? 'text-xl'
                                        : 'text-3xl'
                                }`}
                    >
                        {props.name}
                    </div>

                    <div className=" w-full h-16 flex flex-wrap content-center justify-between pr-6">
                        <div className="flex flex-row w-8 h-8">
                            <img className="" src={alarm} alt="" />

                            <div className="font-bold text-black flex text-2xl md:text-3xl lg:text-4xl xl:text-4xl xl:ml-3 xl:pb-8 ">
                                {
                                    crossFilter('behaviour', runningPeriode)
                                        .length
                                }
                            </div>
                        </div>
                        <div className="flex flex-row w-8 h-8">
                            <img className="" src={bookPile} alt="" />

                            <div className="font-bold text-black flex text-2xl md:text-3xl lg:text-4xl xl:text-4xl xl:ml-3 xl:pb-8 ">
                                {crossFilter('homework', runningPeriode).length}
                            </div>
                        </div>
                        <div className="flex flex-row w-8 h-8">
                            <img className="" src={schoolBag} alt="" />

                            <div className="font-bold text-black flex text-2xl md:text-3xl lg:text-4xl xl:text-4xl xl:ml-3 xl:pb-8 ">
                                {crossFilter('supply', runningPeriode).length}
                            </div>
                        </div>
                        <div className="flex flex-row w-8 h-8">
                            <img className="" src={pen} alt="" />

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
        </div>
    )
}
