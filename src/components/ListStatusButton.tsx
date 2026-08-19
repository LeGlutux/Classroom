import React, { useState } from 'react'
import firebase from 'firebase/app'
import { IconCheck, IconClose, IconQuestion } from './Icons'

interface ListStatusButtonProps {
    studentId: string
    userId: string
    listId: string
    indexOfItem: number
    listState: number[]
}

export const listStatusClass = (state: number) => {
    if (state === 1) return 'is-ok'
    if (state === 2) return 'is-no'
    if (state === 3) return 'is-maybe'
    return 'is-empty'
}

export const ListStatusMark = ({ state }: { state: number }) => {
    if (state === 1) return <IconCheck />
    if (state === 2) return <IconClose />
    if (state === 3) return <IconQuestion />
    return null
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

    return (
        <button
            type="button"
            className={`list-status ${listStatusClass(state)}`}
            onClick={handleClick}
        >
            <ListStatusMark state={state} />
        </button>
    )
}
