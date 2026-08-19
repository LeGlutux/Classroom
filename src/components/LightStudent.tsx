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
        <div className="flex flex-col w-full items-center py-1 text-center">
            <div
                className={`font-studentName text-gray-900 font-medium leading-tight ${
                    longName ? 'text-lg' : 'text-2xl'
                }`}
            >
                {props.surname}
            </div>
            <div
                className={`font-studentName text-gray-900 font-bold leading-tight ${
                    longName ? 'text-lg' : 'text-2xl'
                }`}
            >
                {props.name}
            </div>
        </div>
    )
}
