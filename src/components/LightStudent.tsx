import React, { useContext } from 'react'
import { AuthContext } from '../Auth'

interface StudentProps {
    name: string
    surname: string
    classes: string
    id: string
}

export default (props: StudentProps) => {
    const { currentUser } = useContext(AuthContext)
    if (currentUser === null) return <div />

    const longName = props.surname.length + props.name.length > 20

    return (
        <div className="flex flex-col w-full items-center py-2">
            <div
                className={`font-studentName text-gray-900 font-medium ${
                    longName ? 'text-xl' : 'text-3xl'
                }`}
            >
                {props.surname}
            </div>
            <div
                className={`font-studentName text-gray-900 font-bold mt-1 ${
                    longName ? 'text-xl' : 'text-3xl'
                }`}
            >
                {props.name}
            </div>
        </div>
    )
}
