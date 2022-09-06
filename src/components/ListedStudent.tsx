import React from 'react'
import ListStatusButton from './ListStatusButton'
import { useListState } from '../hooks'
import firebase from 'firebase'

interface ListedStudentProps {
    name: string
    surname: string
    classes: string
    studentId: string
    userId: string
    currentList: firebase.firestore.DocumentData
}

export default (props: ListedStudentProps) => {
    const { listState, loading } = useListState(
        props.userId,
        props.studentId,
        props.currentList.id
    )

    const fullName = props.name.toUpperCase().concat(' ').concat(props.surname)

    const shortedFullName =
        fullName.length > 15 ? fullName.substring(0, 15).concat('.') : fullName

    while (loading === true) return <div />

    return (
        <div className="flex flex-row w-full h-8 border-b-2 border-gray-300">
            <div className="flex border-r-2 border-gray-300 w-5/12 overflow-x-hidden text-center pl-1">
                {shortedFullName}
            </div>
            <div className="flex border-r-2 border-gray-300 justify-center w-2/12 overflow-x-hidden text-center">
                {props.classes}
            </div>

            <div className="flex w-8 h-full">
                <ListStatusButton
                    studentId={props.studentId}
                    userId={props.userId}
                    listId={props.currentList.id}
                    listState={listState}
                    indexOfItem={0}
                />
            </div>
            {props.currentList.itemN > 1 && (
                <div className="flex w-8 h-full">
                    <ListStatusButton
                        studentId={props.studentId}
                        userId={props.userId}
                        listId={props.currentList.id}
                        listState={listState}
                        indexOfItem={1}
                    />
                </div>
            )}

            {props.currentList.itemN > 2 && (
                <div className="flex w-8 h-full">
                    <ListStatusButton
                        studentId={props.studentId}
                        userId={props.userId}
                        listId={props.currentList.id}
                        listState={listState}
                        indexOfItem={2}
                    />
                </div>
            )}

            {props.currentList.itemN > 3 && (
                <div className="flex w-8 h-full">
                    <ListStatusButton
                        studentId={props.studentId}
                        userId={props.userId}
                        listId={props.currentList.id}
                        listState={listState}
                        indexOfItem={3}
                    />
                </div>
            )}

            {props.currentList.itemN > 4 && (
                <div className="flex w-8 h-full">
                    <ListStatusButton
                        studentId={props.studentId}
                        userId={props.userId}
                        listId={props.currentList.id}
                        listState={listState}
                        indexOfItem={4}
                    />
                </div>
            )}
        </div>
    )
}
