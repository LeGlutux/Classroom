import React from 'react'
import firebase from 'firebase/app'
import { useCross } from '../hooks'

interface CrossTabProps {
    studentId: string
    userId: string
    week: number
    index: number
    crossRefresher: number
    iconsNumber: number
}

export default (props: CrossTabProps) => {
    const { cross } = useCross(
        props.userId,
        props.studentId,
        props.crossRefresher
    )

    const visible = (n: number) => {
        if (n === -1) return 6
        else return n
    }
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

        if (
            filtered.length > 3 ||
            (props.iconsNumber === -1 && filtered.length > 1)
        ) {
            return (
                <div
                    className={`flex flex-row items-center h-2 ${
                        visible(props.iconsNumber) === 6
                            ? 'text-sm'
                            : 'text-lg font-bold'
                    }`}
                >
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
            <div className="w-4 text-sm h-4 my-2 flex items-center">
                {props.index}
            </div>
            <div className="w-full h-4 flex flex-row justify-evenly my-2 text-xl">
                <div
                    className={`flex flex-row w-full mx-4 items-center justify-center flex-wrap ${
                        visible(props.iconsNumber) < 1 ? 'hidden' : 'visible'
                    } `}
                >
                    {crossFilter('behaviour')}
                </div>
                <div
                    className={`flex flex-row w-full mx-4 items-center justify-center flex-wrap ${
                        visible(props.iconsNumber) < 2 ? 'hidden' : 'visible'
                    } `}
                >
                    {crossFilter('homework')}
                </div>
                <div
                    className={`flex flex-row w-full mx-4 items-center justify-center flex-wrap ${
                        visible(props.iconsNumber) < 3 ? 'hidden' : 'visible'
                    } `}
                >
                    {crossFilter('supply')}
                </div>
                <div
                    className={`flex flex-row w-full mx-4 items-center justify-center flex-wrap ${
                        visible(props.iconsNumber) < 4 ? 'hidden' : 'visible'
                    } `}
                >
                    {crossFilter('observation')}
                </div>
                <div
                    className={`flex flex-row w-full mx-4 items-center justify-center flex-wrap ${
                        visible(props.iconsNumber) < 5 ? 'hidden' : 'visible'
                    } `}
                >
                    {crossFilter('calculator')}
                </div>
                <div
                    className={`flex flex-row w-full mx-4 items-center justify-center flex-wrap ${
                        visible(props.iconsNumber) < 6 ? 'hidden' : 'visible'
                    } `}
                >
                    {crossFilter('phone')}
                </div>
            </div>
        </div>
    )
}
