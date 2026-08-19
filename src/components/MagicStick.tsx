import React, { useContext, useRef } from 'react'
import { AuthContext } from '../Auth'
import LightStudent from './LightStudent'
import Firebase from '../firebase'
import useOnClickOutside from '../hooks'

interface MagicStickProps {
    toggleSelected: (studentId: string) => void
    allStudents: firebase.firestore.DocumentData[]
    students: firebase.firestore.DocumentData[]
    displayRandomStudent: boolean
    setDisplayRandomStudent: React.Dispatch<React.SetStateAction<boolean>>
    withMemory: boolean
    onFilter: (group: string) => void
    displayedGroup: string
}

export default (props: MagicStickProps) => {
    const db = Firebase.firestore()
    const { currentUser } = useContext(AuthContext)
    if (currentUser === null) return <div />

    const randNumber = Math.floor(Math.random() * props.students.length)
    const randomStudent = props.students[randNumber]
    const ref1 = useRef(null)
    const ref2 = useRef(null)
    const ref3 = useRef(null)

    const handleClickOutside = () => {
        props.setDisplayRandomStudent(false)
        props.onFilter(props.displayedGroup)
    }
    useOnClickOutside(ref1, handleClickOutside)
    useOnClickOutside(ref2, handleClickOutside)
    useOnClickOutside(ref3, handleClickOutside)

    const handleRememberStudent = (id: string) => {
        db.collection('users')
            .doc(currentUser.uid)
            .collection('eleves')
            .doc(id)
            .update({
                selected: true,
            })
        props.toggleSelected(id)
        props.onFilter(props.displayedGroup)
    }

    //////////////////////////////// Tous les élèves ont étés choisis ////////////////////////////////
    if (randomStudent === undefined) {
        return (
            <div
                className={`flex flex-col z-50 absolute w-full h-full items-center justify-center self-center ${
                    props.displayRandomStudent ? 'visible' : 'invisible'
                }`}
                style={{ backgroundColor: 'rgba(31,27,22,0.35)' }}
            >
                <div
                    ref={ref1}
                    className={`modal-card ${
                        props.displayRandomStudent ? 'fade-in' : 'invisible'
                    } `}
                >
                    <div className="w-3/4 h-full flex flex-col justify-center">
                        <div className="h-24 pt-8 sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-center font-bold">
                            Tous les élèves ont été choisis, l'ensemble a été
                            réinitialisé.
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    //////////////////////////////// Aléatoire avec mémoire ////////////////////////////////

    if (props.withMemory) {
        return (
            <div
                className={`flex flex-col z-50 absolute w-full h-full items-center justify-center self-center ${
                    props.displayRandomStudent ? 'visible' : 'invisible'
                }`}
                style={{ backgroundColor: 'rgba(31,27,22,0.35)' }}
            >
                <div
                    ref={ref2}
                    className={`modal-card ${
                        props.displayRandomStudent ? 'fade-in' : 'invisible'
                    }`}
                >
                    <div className="w-3/4 h-full flex justify-center sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-center font-bold">
                        <LightStudent
                            classes={randomStudent.classes[0]}
                            name={randomStudent.name}
                            surname={randomStudent.surname}
                            id={randomStudent.id}
                        />
                    </div>

                    <div className="modal-actions">
                        <button
                            className="btn-ghost"
                            onClick={() => {
                                props.setDisplayRandomStudent(false)
                            }}
                        >
                            Oublier
                        </button>
                        <button
                            className="btn-secondary"
                            onClick={() => {
                                handleRememberStudent(randomStudent.id)
                                props.setDisplayRandomStudent(false)
                            }}
                        >
                            Retenir
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    //////////////////////////////// Aléatoire sans mémoire ////////////////////////////////

    return (
        <div
            className={`flex flex-col absolute w-full h-full items-center justify-center self-center ${
                props.displayRandomStudent ? 'visible' : 'invisible'
            }`}
            style={{ backgroundColor: 'rgba(31,27,22,0.35)' }}
        >
            <div
                ref={ref3}
                className={`modal-card ${
                    props.displayRandomStudent ? 'fade-in' : 'invisible'
                }`}
            >
                <div className="w-3/4 h-full flex justify-center sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-center font-bold">
                    <LightStudent
                        name={randomStudent.name}
                        surname={randomStudent.surname}
                        id={randomStudent.id}
                        classes={randomStudent.classes[0]}
                    />
                </div>
            </div>
        </div>
    )
}
