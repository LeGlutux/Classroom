import React from 'react'
import firebase from 'firebase/app'
import { useCross } from '../hooks'

interface CrossTabProps {
    studentId: string
    userId: string
    week: number
    index: number
    crossRefresher: number
}

export default (props: CrossTabProps) => {
    const { cross } = useCross(
        props.userId,
        props.studentId,
        props.crossRefresher
    )
    const crossFilter = (type: string) => {
        const filtered = cross
            .filter(
                (element: firebase.firestore.DocumentData) =>
                    element.type === type
            )
            .filter(
                (element: firebase.firestore.DocumentData) =>
                    element.time.toDate() > new Date(props.week) &&
                    element.time.toDate().getTime() <
                        new Date(props.week + 7 * 86400000)
            )

        const dot = filtered.map((c) => {
            return (
                <div
                    key={c.time}
                    className="bg-red-600 rounded-full overflow-hidden h-2 w-2 mx-1"
                />
            )
        })

        if (filtered.length > 3) {
            return (
                <div className="flex flex-row text-lg items-center h-2 font-bold">
                    {filtered.length}{' '}
                    <div className="bg-red-600 rounded-full overflow-hidden h-2 w-2 mx-1" />
                </div>
            )
        } else {
            return dot
        }
    }
    return (
        <div className="flex flex-row items-center justify-center">
            <div className="w-6 text-xl h-4 my-2 flex items-center">
                {props.index}
            </div>
            <div className="w-full h-4 flex flex-row justify-evenly my-2 text-xl">
                <div className="flex flex-row w-full mx-4 items-center justify-center flex-wrap">
                    {crossFilter('behaviour')}
                </div>
                <div className="flex flex-row w-full mx-4 items-center justify-center flex-wrap">
                    {crossFilter('homework')}
                </div>
                <div className="flex flex-row w-full mx-4 items-center justify-center flex-wrap">
                    {crossFilter('supply')}
                </div>
                <div className="flex flex-row w-full mx-4 items-center justify-center flex-wrap">
                    {crossFilter('observation')}
                </div>
            </div>
        </div>
    )
}
