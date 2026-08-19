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

    return (
        <div className="flex flex-col w-full items-center justify-around py-4">
            <div className="w-full">
                <div className="student-surname font-studentName text-2xl font-medium">
                    {props.surname}
                </div>
                <div className="student-name font-studentName text-3xl font-bold">
                    {props.name}
                </div>
            </div>
        </div>
    )
}
