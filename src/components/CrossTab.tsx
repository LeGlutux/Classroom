import React from 'react'
import firebase from 'firebase/app'
import { useCross } from '../hooks'
import { CrossPolarity, CrossSlot } from '../functions'

interface CrossTabProps {
    studentId: string
    userId: string
    week: number
    index: number
    crossRefresher: number
    slots: CrossSlot[]
}

const Dot = ({ polarity }: { polarity: CrossPolarity }) => (
    <div
        className={`cross-dot ${
            polarity === 'positive' ? 'cross-dot-positive' : 'cross-dot-negative'
        }`}
    />
)

export default (props: CrossTabProps) => {
    const { cross } = useCross(
        props.userId,
        props.studentId,
        props.crossRefresher
    )

    const crossFilter = (type: string, polarity: CrossPolarity) => {
        const filtered = cross
            .filter(
                (element: firebase.firestore.DocumentData) =>
                    element.type === type
            )
            .filter((element: firebase.firestore.DocumentData) => {
                const time = element.time?.toDate
                    ? element.time.toDate()
                    : new Date(element.time)
                return (
                    time > new Date(props.week) &&
                    time.getTime() < new Date(props.week + 7 * 86400000).getTime()
                )
            })

        const dot = filtered.map((c) => (
            <Dot key={c.id || c.time} polarity={polarity} />
        ))

        if (
            filtered.length > 3 ||
            (props.slots.length === 6 && filtered.length > 1)
        ) {
            return (
                <div
                    className={`flex flex-row items-center h-2 ${
                        props.slots.length === 6
                            ? 'text-sm'
                            : 'text-lg font-bold'
                    }`}
                >
                    {filtered.length} <Dot polarity={polarity} />
                </div>
            )
        }
        return dot
    }

    return (
        <div className="flex flex-row items-center justify-center">
            <div className="w-4 text-sm h-4 my-2 flex items-center">
                {props.index}
            </div>
            <div className="w-full h-4 flex flex-row justify-evenly my-2 text-xl">
                {props.slots.map((slot) => (
                    <div
                        key={slot.type}
                        className="flex flex-row w-full mx-4 items-center justify-center flex-wrap"
                    >
                        {crossFilter(slot.type, slot.polarity)}
                    </div>
                ))}
            </div>
        </div>
    )
}
