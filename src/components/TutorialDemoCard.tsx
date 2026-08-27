import React, { useRef, useState } from 'react'
import info from '../images/info.png'
import pen from '../images/edit.png'
import { buildCrossSlots, handleIcon } from '../functions'

const DEMO_SLOTS = buildCrossSlots([1, 2, 13, 0, 0, 0], [16, 0, 0, 0, 0, 0]).map(
    (slot) => ({
        ...slot,
        src: handleIcon(slot.icon),
    })
)

const DemoCross = ({
    src,
    count,
    onAdd,
    onRemove,
}: {
    src: string
    count: number
    onAdd: () => void
    onRemove: () => void
}) => {
    const longPress = useRef(false)
    const timer = useRef<number | null>(null)

    const start = () => {
        longPress.current = false
        timer.current = window.setTimeout(() => {
            longPress.current = true
            onRemove()
        }, 500)
    }

    const cancel = () => {
        if (timer.current !== null) {
            window.clearTimeout(timer.current)
            timer.current = null
        }
    }

    return (
        <div className="flex flex-row items-center">
            <button
                type="button"
                className="w-8 h-8 rounded-full touch-manipulation tap-target-44 flex items-center justify-center student-cross-btn"
                onPointerDown={start}
                onPointerUp={cancel}
                onPointerLeave={cancel}
                onPointerCancel={cancel}
                onContextMenu={(event) => event.preventDefault()}
                onClick={(event) => {
                    if (longPress.current) {
                        event.preventDefault()
                        longPress.current = false
                        return
                    }
                    onAdd()
                }}
            >
                <img className="student-cross-icon" src={src} alt="" />
            </button>
            <div className="student-cross-count">{count}</div>
        </div>
    )
}

const TutorialDemoCard = ({
    swipe,
    interactive,
    focus,
}: {
    swipe?: boolean
    interactive?: boolean
    focus?: 'demo-i' | 'demo-cross' | 'demo-note' | 'demo-card'
}) => {
    const [counts, setCounts] = useState<{ [type: string]: number }>({})
    const [note, setNote] = useState('')

    return (
        <div
            className={`tutorial-demo${swipe ? ' is-swiping' : ''}${
                focus === 'demo-card' ? ' tutorial-lit' : ''
            }`}
        >
            <div className="sms-swipe tutorial-demo-swipe">
                <div className="sms-swipe-rail" aria-hidden="true">
                    SMS
                </div>
                <div className="student-card w-full tutorial-demo-card">
                    <div className="flex justify-between flex-col">
                        <div className="flex flex-row items-center">
                            <div className="flex flex-row w-full justify-between items-center">
                                <div className="flex flex-row flex-nowrap items-center">
                                    <div className="student-name ml-2 text-gray-900 font-medium">
                                        Pat
                                    </div>
                                    <div className="student-name ml-2 text-gray-900 font-bold">
                                        Mercier
                                    </div>
                                </div>
                                <span
                                    className={`flex mr-4${
                                        focus === 'demo-i' ? ' tutorial-lit' : ''
                                    }`}
                                >
                                    <img
                                        className="flex w-4 self-center"
                                        src={info}
                                        alt=""
                                    />
                                </span>
                            </div>
                        </div>
                        <div
                            className={`w-full h-12 flex p-2 items-center justify-between pr-6${
                                focus === 'demo-cross' ? ' tutorial-lit' : ''
                            }`}
                        >
                            {DEMO_SLOTS.map((slot) => (
                                <DemoCross
                                    key={slot.type}
                                    src={slot.src}
                                    count={counts[slot.type] || 0}
                                    onAdd={() => {
                                        if (!interactive) return
                                        setCounts({
                                            ...counts,
                                            [slot.type]:
                                                (counts[slot.type] || 0) + 1,
                                        })
                                    }}
                                    onRemove={() => {
                                        if (!interactive) return
                                        const current = counts[slot.type] || 0
                                        if (current < 1) return
                                        setCounts({
                                            ...counts,
                                            [slot.type]: current - 1,
                                        })
                                    }}
                                />
                            ))}
                        </div>
                        <div
                            className={`student-note${
                                focus === 'demo-note' ? ' tutorial-lit' : ''
                            }`}
                        >
                            <button
                                type="button"
                                className={`student-note-btn ${
                                    note ? '' : 'is-empty'
                                }`}
                                onClick={() => {
                                    if (!interactive) return
                                    setNote(
                                        note ? '' : 'Oubli du cahier aujourd’hui'
                                    )
                                }}
                            >
                                <img src={pen} alt="" />
                                <span>{note || 'Ajouter une note'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TutorialDemoCard
