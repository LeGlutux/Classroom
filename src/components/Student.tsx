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

    while (loading) return <div />

    return (
        <div
            className={`flex mt-1 flex-row w-full md:w-1/2 lg:w-1/2 xl:w-1/3 items-center ${
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
                        <div className="flex h-full items-center self-center mt-2 ml-2 xl:pt-6 static">
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
                                    src={brain}
                                    alt=""
                                />
                            </button>
                        </div>
                        <div className="flex flex-row w-full justify-between">
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
                                className="flex flex-row flex-nowrap mt-2 items-baseline"
                            >
                                <div
                                    className={`student-surname font-studentName ml-2 font-medium text-2xl md:text-3xl whitespace-nowrap ${
                                        highlight ? 'text-red-600' : ''
                                    }
                                `}
                                >
                                    {shortSurname}
                                </div>
                                <div
                                    className={`student-name font-studentName ml-2 font-bold text-2xl md:text-3xl whitespace-nowrap ${
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
                        className={`w-full h-12 flex p-2 content-center justify-between  pr-6 ${
                            props.icons[5] === 'none' ? '' : 'mb-6'
                        }`}
                    >
                        <div
                            className={`flex ${
                                props.icons[0] === 'none' ? 'hidden' : 'visible'
                            } ${
                                props.icons[5] === 'none'
                                    ? 'flex-row'
                                    : 'flex-col items-center'
                            }`}
                        >
                            <button
                                type="button"
                                onClick={() => handleAddCross('behaviour')}
                                className="w-8 h-8 lg:w-12 lg:h-12 xl:w-12 xl:h-12 rounded-full touch-manipulation tap-target-44 flex items-center justify-center"
                            >
                                <img className="" src={props.icons[0]} alt="" />
                            </button>
                            <div className="font-bold text-black flex text-2xl md:text-3xl lg:text-4xl xl:text-3xl xl:ml-3 xl:pb-8 ">
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
                                    ? 'flex-row'
                                    : 'flex-col items-center'
                            }`}
                        >
                            <button
                                type="button"
                                onClick={() => handleAddCross('homework')}
                                className="w-8 h-8 lg:w-12 lg:h-12 xl:w-12 xl:h-12 rounded-full touch-manipulation tap-target-44 flex items-center justify-center"
                            >
                                <img className="" src={props.icons[1]} alt="" />
                            </button>
                            <div className="font-bold text-black flex text-2xl md:text-3xl lg:text-4xl xl:text-3xl xl:ml-3 xl:pb-8 ">
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
                                    ? 'flex-row'
                                    : 'flex-col items-center'
                            }`}
                        >
                            <button
                                type="button"
                                onClick={() => handleAddCross('supply')}
                                className="w-8 h-8 lg:w-12 lg:h-12 xl:w-12 xl:h-12 rounded-full touch-manipulation tap-target-44 flex items-center justify-center"
                            >
                                <img className="" src={props.icons[2]} alt="" />
                            </button>
                            <div className="font-bold text-black flex text-2xl md:text-3xl lg:text-4xl xl:text-3xl xl:ml-3 xl:pb-8 ">
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
                                    ? 'flex-row'
                                    : 'flex-col items-center'
                            }`}
                        >
                            <button
                                type="button"
                                onClick={() => handleAddCross('observation')}
                                className="w-8 h-8 lg:w-12 lg:h-12 xl:w-12 xl:h-12 rounded-full touch-manipulation tap-target-44 flex items-center justify-center"
                            >
                                <img className="" src={props.icons[3]} alt="" />
                            </button>
                            <div className="font-bold text-black flex text-2xl md:text-3xl lg:text-4xl xl:text-3xl xl:ml-3 xl:pb-8 ">
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
                                    ? 'flex-row'
                                    : 'flex-col items-center'
                            }`}
                        >
                            <button
                                type="button"
                                onClick={() => handleAddCross('calculator')}
                                className="w-8 h-8 lg:w-12 lg:h-12 xl:w-12 xl:h-12 rounded-full touch-manipulation tap-target-44 flex items-center justify-center"
                            >
                                <img className="" src={props.icons[4]} alt="" />
                            </button>
                            <div className="font-bold text-black flex text-2xl md:text-3xl lg:text-4xl xl:text-3xl xl:ml-3 xl:pb-8 ">
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
                                    ? 'flex-row'
                                    : 'flex-col items-center'
                            }`}
                        >
                            <button
                                type="button"
                                onClick={() => handleAddCross('phone')}
                                className="w-8 h-8 lg:w-12 lg:h-12 xl:w-12 xl:h-12 rounded-full touch-manipulation tap-target-44 flex items-center justify-center"
                            >
                                <img className="" src={props.icons[5]} alt="" />
                            </button>
                            <div className="font-bold text-black flex text-2xl md:text-3xl lg:text-4xl xl:text-3xl xl:ml-3 xl:pb-8 ">
                                {
                                    crossFilter('phone', props.runningPeriode)
                                        .length
                                }
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row lg:mt-3 xl:mt-5">
                        <StudentComment
                            currentUserId={props.currentUser}
                            currentStudentId={props.id}
                            comment={props.comment ? props.comment : ''}
                        />
                    </div>
                    <div className="border-b border-gray-200 w-2/3 self-center mt-3 mb-2" />
                </div>
            </div>
        </div>
    )
}

export default StudentComponent
