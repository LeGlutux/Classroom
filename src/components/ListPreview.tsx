import React, { useState } from 'react'
import firebase from 'firebase/app'
import { useStudents } from '../hooks'
import { Link } from 'react-router-dom'
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
        students
            .filter((s) => s.classes.includes(props.classes[0]))
            .forEach((s) => {
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
        <div className="list-row">
            <ConfirmModal
                confirm={confirm}
                setConfirm={setConfirm}
                confirmAction={handleDeleteList}
                textBox={'Êtes-vous sûr(e) de vouloir supprimer la liste "'
                    .concat(props.name)
                    .concat('" des ')
                    .concat(props.classes.join(', '))}
            />
            <button
                className="header-icon-btn"
                type="button"
                onClick={() => setConfirm(true)}
                aria-label="Supprimer la liste"
            >
                <svg viewBox="0 0 20 20">
                    <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                </svg>
            </button>
            <Link className="flex flex-row items-center justify-between w-full ml-1" to={'/list/'.concat(props.id)}>
                <div className="font-studentName font-bold text-lg w-5/12">
                    {props.name}
                </div>
                <div className="font-studentName text-sm text-gray-600 w-4/12">
                    {classesToString}
                </div>
                <div className="period-chip">{props.itemsN} items</div>
            </Link>
        </div>
    )
}
