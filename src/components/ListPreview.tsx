import React, { useContext, useState } from 'react'
import firebase from 'firebase/app'
import { useStudents } from '../hooks'
import { Link } from 'react-router-dom'
import { AuthContext } from '../Auth'
import openCard from '../images/openCard.png'
import ConfirmModal from './ConfirmModal'

interface ListPreviewProps {
    currentUserId: string
    id: string
    name: string
    classes: string[]
    itemsN: number
    date: Date
    refresher: React.Dispatch<React.SetStateAction<number>>
}

export default (props: ListPreviewProps) => {
    const classesToString = props.classes.join(', ')
    const { students } = useStudents(props.currentUserId)
    const [confirm, setConfirm] = useState(false)
    const db = firebase.firestore()
    const handleDeleteList = () => {
        db.collection('users')
            .doc(props.currentUserId)
            .collection('lists')
            .doc(props.id)
            .delete()
        students.filter(s => s.classes.includes(props.classes[0])).forEach((s) => {
            db.collection('users')
                .doc(props.currentUserId)
                .collection('eleves')
                .doc(s.id)
                .collection('listes')
                .doc(props.id.concat('s'))
                .delete()
        })

        props.refresher(Math.random())
    }

    return (
        <div
            className={`w-full flex flex-row border-b-2 border-gray-300 justify-between`}
        >

            <ConfirmModal
                confirm={confirm}
                setConfirm={setConfirm}
                confirmAction={handleDeleteList}
                textBox={
                    'Êtes-vous sûr(e) de vouloir supprimer la liste "'.concat(props.name).concat('" des ').concat(props.classes.join(', '))
                }
            />

            <span className="flex ml-4 mr-4 self-center pb-1">
                <svg
                    className="h-4 w-4 fill-current text-grey hover:text-grey-darkest"
                    role="button"
                    onClick={() => setConfirm(true)}
                >
                    <title>Close</title>
                    <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                </svg>
            </span>
            <Link
                className="w-full flex flex-row border-gray-300 justify-between"
                to={'/list/'.concat(props.id)}
            >

                <div className="font-studentName my-1 self-center w-5/12 ml-4 text-xl">
                    {props.name}
                </div>
                <div className="font-studentName my-1 self-center w-3/12 text-xl">
                    {classesToString}
                </div>
                <div className="font-studentName my-1 self-center w-1/12 text-xl">
                    {props.itemsN}
                </div>
                <img
                    className="w-2 h-4 flex self-center mr-1 justify-end"
                    src={openCard}
                    alt=""
                />            </Link>

        </div>
    )
}
