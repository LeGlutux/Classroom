import React, { useState, useEffect } from 'react'
import info from '../images/info.png'
import Firebase from '../firebase'
import firebase from 'firebase/app'
import { Link } from 'react-router-dom'
import brain from '../images/brain.png'
import StudentComment from './StudentComment'
import { useCross } from '../hooks'
import { StudentInterface } from '../interfaces/Student'

interface StudentProps {
    displayedStudents: StudentInterface[]
    name: string
    surname: string
    classes: string
    id: string
    currentUserId: string
    loading: boolean
    highlight: boolean
    toggleSelected: (studentId: string) => void
    toggleHighlight: (studentId: string) => void
    selected: boolean
    comment?: string
    refresher: (group: string) => void
    displayedGroup: string
    currentUser: string
    periodes: Date[]
    runningPeriode: number
    icons: string[]
}

const StudentComponent: React.FC<StudentProps> = (props) => {

    const { cross, loading } = useCross(props.currentUser, props.id)
    const db = Firebase.firestore()
    const [highlight, setHighlight] = useState(props.highlight)
    const [selected, setSelected] = useState(props.selected)
    const [crosses, setCrosses] =
        useState<firebase.firestore.DocumentData[]>(cross)
    const [hidden, setHidden] = useState(false)

    useEffect(() => {
        setSelected(props.selected)
    }, [props.selected])

    useEffect(() => {
        if (!props.displayedStudents.map((s) => s.id).includes(props.id))
            setHidden(true)
        else setHidden(false)
    }, [props.displayedStudents, props.id])

    useEffect(() => {
        setCrosses(cross)
    }, [cross, loading])

    const handleForget = () => {
        db.collection('users')
            .doc(props.currentUser)
            .collection('eleves')
            .doc(props.id)
            .update({
                selected: false,
            })
        props.refresher(props.displayedGroup)
        props.toggleSelected(props.id)
    }

    const crossFilter = (crossType: string, runningP: number) => {
        const filtered = crosses.filter(
            (element: firebase.firestore.DocumentData) =>
                element && element.type === crossType
        )
        
        if (runningP === props.periodes.length) {
            // Dernière période : toutes les crosses après la dernière date de période
            const periodeStart = props.periodes[runningP - 1]
            return filtered.filter((element: firebase.firestore.DocumentData) => {
                const crossTime = element.time?.toDate ? element.time.toDate() : element.time
                return crossTime > periodeStart
            })
        } else {
            // Période intermédiaire : crosses entre deux dates
            const periodeStart = props.periodes[runningP - 1]
            const periodeEnd = props.periodes[runningP]
            return filtered.filter((element: firebase.firestore.DocumentData) => {
                const crossTime = element.time?.toDate ? element.time.toDate() : element.time
                return crossTime > periodeStart && crossTime < periodeEnd
            })
        }
    }

    const crossIdentifier = (type: string) => {
        if (type === 'behaviour') return '1'
        if (type === 'homework') return '2'
        if (type === 'supply') return '3'
        if (type === 'observation') return '4'
        if (type === 'calculator') return '5'
        if (type === 'phone') return '6'
        else return '000'
    }
    const newCrossId = (type: string) => {
        return crossIdentifier(type).concat('c').concat(Date.now().toString())
    }
    const handleAddCross = (crossType: string) => {
        if (props.runningPeriode === props.periodes.length) {
            const newDate = new Date()
            db.collection('users')
                .doc(props.currentUser)
                .collection('eleves')
                .doc(props.id)
                .collection('crosses')
                .doc(newCrossId(crossType))
                .set({
                    type: crossType,
                    time: newDate,
                    id: newCrossId(crossType),
                    student_id: props.id,
                    student_name: props.name,
                    student_surname: props.surname,
                    student_classes: props.classes,
                })
            db.collection('users')
                .doc(props.currentUser)
                .collection('eleves')
                .doc(props.id)
                .update({
                    crosses: firebase.firestore.FieldValue.arrayUnion(
                        newCrossId(crossType)
                    ),
                })

            const newCross = crosses.concat([
                { type: crossType, id: newCrossId(crossType), time: newDate },
            ])
            setCrosses(newCross)
        }
    }

    const shortName =
        (props.name + props.surname).length > 19 && props.surname.length >= 16
            ? props.name.substring(0, 3).concat('.')
            : (props.name + props.surname).length > 19 &&
              props.surname.length < 16
            ? props.name.substring(0, 17 - props.surname.length).concat('.')
            : props.name

    const shortSurname =
        (shortName + props.surname).length > 19 && props.surname.length > 15
            ? props.surname.substring(0, 12).concat('.')
            : props.surname

    const crossTypes = [
        'behaviour',
        'homework',
        'supply',
        'observation',
        'calculator',
        'phone',
    ]

    while (loading) return <div />

    return (
        <div
            className={`flex w-full md:w-1/2 lg:w-1/2 xl:w-1/3 items-center ${
                hidden ? 'hidden' : ''
            } ${
                props.currentUserId === '26kiVujCgjNpzCkYwugqkrt63Hx1'
                    ? 'iphone-vertical'
                    : ''
            }`}
        >
            <div
                className={`student-card w-full ${
                    highlight ? 'is-highlight' : ''
                } ${
                    props.runningPeriode === props.periodes.length
                        ? ''
                        : 'is-archived'
                }`}
            >
                <div className="student-card-head">
                    <button
                        type="button"
                        className={`memory-btn ${
                            selected === false || selected === undefined
                                ? 'invisible'
                                : ''
                        }`}
                        onClick={handleForget}
                        aria-label="Oublier l'élève"
                    >
                        <img src={brain} alt="" />
                    </button>
                    <button
                        type="button"
                        className="student-card-names"
                        onClick={() => {
                            db.collection('users')
                                .doc(props.currentUser)
                                .collection('eleves')
                                .doc(props.id)
                                .update({
                                    highlight: !highlight,
                                })
                            setHighlight(!highlight)
                            props.toggleHighlight(props.id)
                        }}
                    >
                        <span className="student-surname">{shortSurname}</span>
                        <span className="student-name">{shortName}</span>
                    </button>
                    <Link
                        className="student-info-btn"
                        to={'/student/'.concat(props.id)}
                        aria-label="Fiche élève"
                    >
                        <img src={info} alt="" />
                    </Link>
                </div>
                <div
                    className={`cross-row ${
                        props.icons[5] === 'none' ? '' : 'is-stacked'
                    }`}
                >
                    {crossTypes.map((type, index) =>
                        props.icons[index] === 'none' ? null : (
                            <button
                                key={type}
                                type="button"
                                className="cross-stat touch-manipulation tap-target-44"
                                onClick={() => handleAddCross(type)}
                            >
                                <img src={props.icons[index]} alt="" />
                                <span className="cross-count">
                                    {
                                        crossFilter(
                                            type,
                                            props.runningPeriode
                                        ).length
                                    }
                                </span>
                            </button>
                        )
                    )}
                </div>
                <StudentComment
                    currentUserId={props.currentUser}
                    currentStudentId={props.id}
                    comment={props.comment ? props.comment : ''}
                />
            </div>
        </div>
    )
}

export default StudentComponent
