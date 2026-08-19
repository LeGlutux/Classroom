import React, { useState } from 'react'
import firebase from 'firebase/app'

interface ListStatusButtonProps {
    studentId: string
    userId: string
    listId: string
    indexOfItem: number
    listState: number[]
}

export default (props: ListStatusButtonProps) => {
    const db = firebase.firestore()
    const originalState = props.listState[props.indexOfItem]
    const [state, setState] = useState(originalState)
    const newState = props.listState

    // states : 0 -> empty // 1 -> check // 2 -> uncheck // 3 -> question mark
    const handleClick = () => {
        if (state === 3) setState(0)
        else setState(state + 1)
        newState.splice(
            props.indexOfItem,
            1,
            newState[props.indexOfItem] >= 3
                ? 0
                : newState[props.indexOfItem] + 1
        )
        db.collection('users')
            .doc(props.userId)
            .collection('eleves')
            .doc(props.studentId)
            .collection('listes')
            .doc(props.listId.concat('s'))
            .update({ state: newState })
    }
    const stateColor = (s: number) => {
        if (state === 0) return 'bg-white'
        if (state === 1) return 'bg-green-600'
        if (state === 2) return 'bg-red-600'
        if (state === 3) return 'bg-yellow-600'
        else return ''
    }

    return (
        <button
            className={`flex w-full h-full justify-center items-center text-xl font-bold border-gray-200 border-r-2 transition-all hover:opacity-80 box-border flex-shrink-0 ${stateColor(
                state
            )}`}
            style={{ minWidth: '54px', width: '100%' }}
            onClick={() => handleClick()}
        >
            {state === 1 && <span className="text-white">✓</span>}
            {state === 2 && <span className="text-white">✗</span>}
            {state === 3 && <span className="text-yellow-800">?</span>}
            {state === 0 && <span className="opacity-0 pointer-events-none select-none">&nbsp;</span>}
        </button>
    )
}
