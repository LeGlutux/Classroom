import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../Auth'
import LightStudent from './LightStudent'
import Firebase from '../firebase'
import { StudentInterface } from '../interfaces/Student'

interface MagicStickProps {
    toggleSelected: (studentId: string) => void
    students: StudentInterface[]
    displayRandomStudent: boolean
    setDisplayRandomStudent: React.Dispatch<React.SetStateAction<boolean>>
    onFilter: (group: string) => void
    displayedGroup: string
}

export default (props: MagicStickProps) => {
    const db = Firebase.firestore()
    const { currentUser } = useContext(AuthContext)
    const [randomStudent, setRandomStudent] = useState<
        StudentInterface | undefined
    >(undefined)
    const [ready, setReady] = useState(false)

    useEffect(() => {
        if (!props.displayRandomStudent) {
            setRandomStudent(undefined)
            setReady(false)
            return
        }

        if (props.students.length === 0) {
            setRandomStudent(undefined)
            setReady(true)
            return
        }

        const index = Math.floor(Math.random() * props.students.length)
        setRandomStudent(props.students[index])
        setReady(true)
        // Snapshot at open: do not reshuffle if the list identity changes.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.displayRandomStudent])

    if (currentUser === null || !props.displayRandomStudent || !ready) {
        return null
    }

    const closeWithoutRemembering = () => {
        props.setDisplayRandomStudent(false)
        props.onFilter(props.displayedGroup)
    }

    const handleRememberStudent = (id: string) => {
        db.collection('users')
            .doc(currentUser.uid)
            .collection('eleves')
            .doc(id)
            .update({
                selected: true,
            })
        props.toggleSelected(id)
        props.setDisplayRandomStudent(false)
        props.onFilter(props.displayedGroup)
    }

    if (randomStudent === undefined) {
        return (
            <div className="modal-overlay" onClick={closeWithoutRemembering}>
                <div
                    className="modal-card"
                    onClick={(event) => event.stopPropagation()}
                >
                    <div className="modal-empty">
                        Tous les élèves ont été choisis, l'ensemble a été
                        réinitialisé.
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="modal-overlay" onClick={closeWithoutRemembering}>
            <div
                className="modal-card"
                onClick={(event) => event.stopPropagation()}
            >
                <LightStudent
                    classes={randomStudent.classes[0]}
                    name={randomStudent.name}
                    surname={randomStudent.surname}
                    id={randomStudent.id}
                />
                <div className="modal-actions">
                    <button
                        type="button"
                        className="modal-btn modal-btn-ghost"
                        onClick={closeWithoutRemembering}
                    >
                        Oublier
                    </button>
                    <button
                        type="button"
                        className="modal-btn modal-btn-primary"
                        onClick={() => handleRememberStudent(randomStudent.id)}
                    >
                        Retenir
                    </button>
                </div>
            </div>
        </div>
    )
}
