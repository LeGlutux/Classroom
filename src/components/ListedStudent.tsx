import React from 'react'
import ListStatusButton from './ListStatusButton'
import firebase from 'firebase/app'
import { normalizeListState } from '../utils/listSort'
import { formatListStudentName } from '../utils/listNames'

interface ListedStudentProps {
    name: string
    surname: string
    classes: string
    studentId: string
    userId: string
    currentList: firebase.firestore.DocumentData
    listState?: number[]
    onStateChange?: (next: number[]) => void
    classmates: { surname: string }[]
}

export default (props: ListedStudentProps) => {
    const listState = normalizeListState(props.listState)
    const itemN = props.currentList.itemN || 1
    const label = formatListStudentName(
        { surname: props.surname, name: props.name },
        props.classmates
    )

    return (
        <div className="flex flex-row w-full h-12 items-center rounded-lg box-border">
            <div className="flex border-r-2 border-gray-200 w-5/12 overflow-x-hidden text-center pl-4 font-studentName text-gray-800 box-border">
                {label}
            </div>
            <div className="flex border-r-2 border-gray-200 justify-center w-2/12 overflow-x-hidden text-center font-studentName text-gray-600 box-border">
                {props.classes}
            </div>
            {Array.from({ length: itemN }).map((_, index) => (
                <div
                    key={index}
                    className="flex w-14 h-full flex-shrink-0 box-border"
                    style={{ minWidth: '54px', width: '54px' }}
                >
                    <ListStatusButton
                        studentId={props.studentId}
                        userId={props.userId}
                        listId={props.currentList.id}
                        listState={listState}
                        indexOfItem={index}
                        onStateChange={props.onStateChange}
                    />
                </div>
            ))}
        </div>
    )
}
