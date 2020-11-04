import React, { useContext, useState } from 'react'
import firebase from 'firebase/app'

import { Link } from 'react-router-dom'

interface ListPreviewProps {
    id: string
    name: string
    classes: string[]
    itemsN: number
    date: Date
}

export default (props: ListPreviewProps) => {
    const classesToString = props.classes.join(', ')
    return (
        <Link
            className="w-full flex flex-row border-t-1 border-b-1 border-gray-300 justify-between"
            to={'/list/'.concat(props.id)}
        >
            <div className="font-studentName my-1 self-center w-1/12">' '</div>
            <div className="font-studentName my-1 self-center w-5/12">
                {props.name}
            </div>
            <div className="font-studentName my-1 self-center w-5/12">
                {classesToString}
            </div>
            <div className="font-studentName my-1 self-center w-1/12">
                {props.itemsN}
            </div>
        </Link>
    )
}
