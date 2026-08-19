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
        <div className="pick-name flex flex-col w-full items-center justify-around py-4">
            <div className="student-surname">{props.surname}</div>
            <div className="student-name">{props.name}</div>
        </div>
    )
}
