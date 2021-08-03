import React, { useContext, useState } from 'react'
import firebase from 'firebase/app'
import { useStudents } from '../hooks'
import { Link } from 'react-router-dom'
import { AuthContext } from '../Auth'

interface ListPreviewProps {
    id: string
    name: string
    classes: string[]
    itemsN: number
    date: Date
}

export default (props: ListPreviewProps) => {
    const { currentUser } = useContext(AuthContext)
    if (currentUser === null) return <div />
    const [disappear, setDisappear] = useState(false)
    const classesToString = props.classes.join(', ')
    const { students } = useStudents(currentUser.uid)
    const db = firebase.firestore()
    const handleDeleteList = () => {
        db.collection('users')
            .doc(currentUser.uid)
            .collection('lists')
            .doc(props.id)
            .delete()
        students.filter(s => s.classes.includes(props.classes[0])).forEach((s) => {
            db.collection('users')
                .doc(currentUser.uid)
                .collection('eleves')
                .doc(s.id)
                .collection('listes')
                .doc(props.id.concat('s'))
                .delete()
        })

        setDisappear(true)
    }
    return (
        <div
            className={`w-full flex flex-row border-t-1 border-b-1 border-gray-300 justify-between ${disappear ? 'disappearing' : 'visible'
                }`}
        >
            <Link
                className="w-full flex flex-row border-t-1 border-b-1 border-gray-300 justify-between"
                to={'/list/'.concat(props.id)}
            >

                <div className="font-studentName my-1 self-center w-7/12 ml-4">
                    {props.name}
                </div>
                <div className="font-studentName my-1 self-center w-3/12">
                    {classesToString}
                </div>
                <div className="font-studentName my-1 self-center w-1/12">
                    {props.itemsN}
                </div>
            </Link>
            <span className="flex ml-4 mr-4 self-center pb-1">
                <svg
                    className="h-4 w-4 fill-current text-grey hover:text-grey-darkest"
                    role="button"
                    onClick={() => handleDeleteList()}
                >
                    <title>Close</title>
                    <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                </svg>
            </span>
        </div>
    )
}
