import React, { useState } from 'react'
import firebase from 'firebase/app'

interface ListStatusButtonProps {
    studentId: string
    userId: string
    itemN: number
    listId: string
    originalState: number
}


export default (props: ListStatusButtonProps) => {
    const db = firebase.firestore()
    const [state, setState] = useState(props.originalState)
    // states : 0 -> empty // 1 -> check // 2 -> uncheck // 3 -> question mark
    const handleClick = () => {
        ((state === 3) ? setState(0) : setState(state + 1))
        db.collection('users').doc(props.userId).collection('eleves').doc(props.studentId).collection('listes').doc(props.listId.concat('s')).update({ state: state })
    }


    return (
        <div className='w-16'>
            <button className={`w-1/5 ${(state === 0) ? 'bg-gray-200' : 'bg-gray-700'}`}
                onClick={() => handleClick()}>
                Click!
            </button>
        </div>
    )
}