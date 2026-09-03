import React, { useEffect, useState } from 'react'
import firebase from 'firebase/app'
import { IconCheck, IconClose, IconQuestion } from './Icons'
import { normalizeListState } from '../utils/listSort'

interface ListStatusButtonProps {
    studentId: string
    userId: string
    listId: string
    indexOfItem: number
    listState: number[]
    onStateChange?: (next: number[]) => void
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
    const cellState = normalizeListState(props.listState)[props.indexOfItem] || 0
    const [state, setState] = useState(cellState)

    useEffect(() => {
        setState(cellState)
    }, [cellState])

    const handleClick = () => {
        const nextValue = state >= 3 ? 0 : state + 1
        const next = normalizeListState(props.listState)
        next[props.indexOfItem] = nextValue
        setState(nextValue)
        if (props.onStateChange) props.onStateChange(next)
        db.collection('users')
            .doc(props.userId)
            .collection('eleves')
            .doc(props.studentId)
            .collection('listes')
            .doc(props.listId.concat('s'))
            .update({ state: next })
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
