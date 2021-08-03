import React from 'react'
import ListStatusButton from "./ListStatusButton"
import { useListState } from '../hooks'

interface ListedStudentProps {
    name: string
    surname: string
    classes: string
    studentId: string
    userId: string
    listId: string
    itemN: number
}

export default (props: ListedStudentProps) => {

const { listState } = useListState(props.userId, props.studentId, props.listId)

    return (
        <div className='flex flex-row w-full h-8 border-b-2 border-gray-300'>
            <div className="flex border-r-2 border-gray-300 w-4/12 overflow-x-hidden text-center">{props.surname.concat(' ').concat(props.name)}</div>
            <div className="flex border-r-2 border-gray-300 w-3/12 overflow-x-hidden text-center">{props.classes}</div>
            <ListStatusButton
                studentId={props.studentId}
                userId={props.userId}
                itemN={props.itemN}
                listId={props.listId}
                originalState={listState}

            />
        </div>
    )
}