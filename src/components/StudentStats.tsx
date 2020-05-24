import React, { useState, ChangeEvent, useContext } from 'react'
import { useCross, useStudent } from '../hooks'
import { AuthContext } from '../Auth'
import { useParams } from 'react-router-dom'

export default () => {
    const { currentUser } = useContext(AuthContext)
    const { id } = useParams()
    if (currentUser === null) return <div />
    if (id === undefined) return <div />
    // const groups = useCross(currentUser.uid, id)
    const student = useStudent(currentUser.uid, id)
    if (student === undefined) return <div />

    return (
        <div className="flex flex-col my-4">
            <div className="w-full text-3xl text-center my-4 bg-red-400">
                {student.name}
            </div>
            <div>{id}</div>
            <div className="w-full text-2xl my-4">potu</div>
            <div className="mx-6 flex flex-col my-4">
                <div className="w-full text-3xl">Croix</div>
            </div>
        </div>
    )
}
