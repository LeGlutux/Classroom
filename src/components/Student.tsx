import React, { useState, useEffect, useRef } from 'react'
import info from '../images/info.png'
import Firebase from '../firebase'
import firebase from 'firebase/app'
import { Link } from 'react-router-dom'
import magicStick from '../images/magicStick.png'
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

interface CrossButtonProps {
    src: string
    onAdd: () => void
    onRemove: () => void
}

const CrossButton: React.FC<CrossButtonProps> = ({ src, onAdd, onRemove }) => {
    const longPress = useRef(false)
    const timer = useRef<number | null>(null)

    const start = () => {
        longPress.current = false
        timer.current = window.setTimeout(() => {
            longPress.current = true
            onRemove()
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
                navigator.vibrate(12)
            }
        }, 500)
    }

    const cancel = () => {
        if (timer.current !== null) {
            window.clearTimeout(timer.current)
            timer.current = null
        }
    }

    return (
        <button
            type="button"
            className="w-7 h-7 lg:w-9 lg:h-9 xl:w-9 xl:h-9 rounded-full touch-manipulation tap-target-44 flex items-center justify-center student-cross-btn"
            onPointerDown={start}
            onPointerUp={cancel}
            onPointerLeave={cancel}
            onPointerCancel={cancel}
            onContextMenu={(event) => event.preventDefault()}
            onClick={(event) => {
                if (longPress.current) {
                    event.preventDefault()
                    longPress.current = false
                    return
                }
                onAdd()
            }}
        >
            <img className="student-cross-icon" src={src} alt="" />
        </button>
    )
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
            const id = newCrossId(crossType)
            db.collection('users')
                .doc(props.currentUser)
                .collection('eleves')
                .doc(props.id)
                .collection('crosses')
                .doc(id)
                .set({
                    type: crossType,
                    time: newDate,
                    id,
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
                    crosses: firebase.firestore.FieldValue.arrayUnion(id),
                })

            const newCross = crosses.concat([
                { type: crossType, id, time: newDate },
            ])
            setCrosses(newCross)
        }
    }

    const crossTime = (element: firebase.firestore.DocumentData) => {
        if (!element || !element.time) return 0
        return element.time.toDate
            ? element.time.toDate().getTime()
            : new Date(element.time).getTime()
    }

    const handleRemoveCross = (crossType: string) => {
        if (props.runningPeriode !== props.periodes.length) return
        const current = crossFilter(crossType, props.runningPeriode)
        if (current.length === 0) return
        const latest = current.reduce((best, element) =>
            crossTime(element) >= crossTime(best) ? element : best
        )
        if (!latest || !latest.id) return

        db.collection('users')
            .doc(props.currentUser)
            .collection('eleves')
            .doc(props.id)
            .collection('crosses')
            .doc(latest.id)
            .delete()
        db.collection('users')
            .doc(props.currentUser)
            .collection('eleves')
            .doc(props.id)
            .update({
                crosses: firebase.firestore.FieldValue.arrayRemove(latest.id),
            })
        setCrosses(crosses.filter((element) => element.id !== latest.id))
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

    while (loading) return <div />

    return (
        <div
            className={`flex flex-row w-full md:w-1/2 lg:w-1/2 xl:w-1/3 items-center ${
                hidden ? 'hidden' : 'visible'
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
                <div
                    className={`flex justify-between flex-col ${
                        props.icons[5] === 'none' ? '' : 'h-38'
                    }`}
                >
                    <div className="flex flex-row items-center">
                        <div className="flex h-full items-center self-center ml-1 static">
                            <button
                                className={`h-6 w-6 xl:h-10 xl:w-10 ${
                                    selected === false || selected === undefined
                                        ? 'invisible'
                                        : 'visible'
                                }`}
                                onClick={handleForget}
                            >
                                <img
                                    className="h-6 w-6 xl:h-10 xl:w-10"
                                    src={magicStick}
                                    alt="élève retenu"
                                />
                            </button>
                        </div>
                        <div className="flex flex-row w-full justify-between items-center">
                            <button
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
                                className="flex flex-row flex-nowrap items-center"
                            >
                                <div
                                    className={`student-name ml-2 text-gray-900 font-medium ${
                                        highlight ? 'text-red-600' : ''
                                    }
                                `}
                                >
                                    {shortSurname}
                                </div>
                                <div
                                    className={`student-name ml-2 text-gray-900 font-bold ${
                                        highlight ? 'text-red-600' : ''
                                    }`}
                                >
                                    {shortName}
                                </div>
                            </button>
                            <Link
                                className="flex mr-4"
                                to={'/student/'.concat(props.id)}
                            >
                                <img
                                    className="flex w-4 self-center"
                                    src={info}
                                    alt=""
                                />
                            </Link>
                        </div>
                    </div>
                    <div
                        className={`w-full h-12 flex p-2 items-center justify-between pr-6 ${
                            props.icons[5] === 'none' ? '' : 'mb-6'
                        }`}
                    >
                        <div
                            className={`flex ${
                                props.icons[0] === 'none' ? 'hidden' : 'visible'
                            } ${
                                props.icons[5] === 'none'
                                    ? 'flex-row items-center'
                                    : 'flex-col items-center'
                            }`}
                        >
                            <CrossButton
                                src={props.icons[0]}
                                onAdd={() => handleAddCross('behaviour')}
                                onRemove={() => handleRemoveCross('behaviour')}
                            />
                            <div className="student-cross-count">
                                {
                                    crossFilter(
                                        'behaviour',
                                        props.runningPeriode
                                    ).length
                                }
                            </div>
                        </div>
                        <div
                            className={`flex ${
                                props.icons[1] === 'none' ? 'hidden' : 'visible'
                            } ${
                                props.icons[5] === 'none'
                                    ? 'flex-row items-center'
                                    : 'flex-col items-center'
                            }`}
                        >
                            <CrossButton
                                src={props.icons[1]}
                                onAdd={() => handleAddCross('homework')}
                                onRemove={() => handleRemoveCross('homework')}
                            />
                            <div className="student-cross-count">
                                {
                                    crossFilter(
                                        'homework',
                                        props.runningPeriode
                                    ).length
                                }
                            </div>
                        </div>
                        <div
                            className={`flex ${
                                props.icons[2] === 'none' ? 'hidden' : 'visible'
                            } ${
                                props.icons[5] === 'none'
                                    ? 'flex-row items-center'
                                    : 'flex-col items-center'
                            }`}
                        >
                            <CrossButton
                                src={props.icons[2]}
                                onAdd={() => handleAddCross('supply')}
                                onRemove={() => handleRemoveCross('supply')}
                            />
                            <div className="student-cross-count">
                                {
                                    crossFilter('supply', props.runningPeriode)
                                        .length
                                }
                            </div>
                        </div>
                        <div
                            className={`flex ${
                                props.icons[3] === 'none' ? 'hidden' : 'visible'
                            } ${
                                props.icons[5] === 'none'
                                    ? 'flex-row items-center'
                                    : 'flex-col items-center'
                            }`}
                        >
                            <CrossButton
                                src={props.icons[3]}
                                onAdd={() => handleAddCross('observation')}
                                onRemove={() => handleRemoveCross('observation')}
                            />
                            <div className="student-cross-count">
                                {
                                    crossFilter(
                                        'observation',
                                        props.runningPeriode
                                    ).length
                                }
                            </div>
                        </div>
                        <div
                            className={`flex ${
                                props.icons[4] === 'none' ? 'hidden' : 'visible'
                            } ${
                                props.icons[5] === 'none'
                                    ? 'flex-row items-center'
                                    : 'flex-col items-center'
                            }`}
                        >
                            <CrossButton
                                src={props.icons[4]}
                                onAdd={() => handleAddCross('calculator')}
                                onRemove={() => handleRemoveCross('calculator')}
                            />
                            <div className="student-cross-count">
                                {
                                    crossFilter(
                                        'calculator',
                                        props.runningPeriode
                                    ).length
                                }
                            </div>
                        </div>
                        <div
                            className={`flex ${
                                props.icons[5] === 'none' ? 'hidden' : 'visible'
                            } ${
                                props.icons[5] === 'none'
                                    ? 'flex-row items-center'
                                    : 'flex-col items-center'
                            }`}
                        >
                            <CrossButton
                                src={props.icons[5]}
                                onAdd={() => handleAddCross('phone')}
                                onRemove={() => handleRemoveCross('phone')}
                            />
                            <div className="student-cross-count">
                                {
                                    crossFilter('phone', props.runningPeriode)
                                        .length
                                }
                            </div>
                        </div>
                    </div>
                    <StudentComment
                            currentUserId={props.currentUser}
                            currentStudentId={props.id}
                            comment={props.comment ? props.comment : ''}
                        />
                </div>
            </div>
        </div>
    )
}

export default StudentComponent
