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
            className={`flex w-8 h-full justify-center items-center text-2xl text-bold border-gray-300 border-r-2 ${stateColor(
                state
            )} `}
            onClick={() => handleClick()}
        />
    )
}
