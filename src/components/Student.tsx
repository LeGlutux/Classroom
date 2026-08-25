import React, { useState, useEffect, useRef } from 'react'
import info from '../images/info.png'
import Firebase from '../firebase'
import firebase from 'firebase/app'
import { Link } from 'react-router-dom'
import magicStick from '../images/magicStick.png'
import StudentComment from './StudentComment'
import { useCross } from '../hooks'
import { StudentInterface } from '../interfaces/Student'
import { CrossPolarity } from '../functions'
import { openStudentSms } from './SmsSheet'
import { lockPageTouch, unlockPageTouch } from '../touchLock'

interface StudentSlot {
    src: string
    type: string
    polarity: CrossPolarity
}

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
    slots: StudentSlot[]
    smsAvailable?: boolean
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
            className="w-8 h-8 lg:w-10 lg:h-10 xl:w-10 xl:h-10 rounded-full touch-manipulation tap-target-44 flex items-center justify-center student-cross-btn"
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

    const swipeWrapRef = useRef<HTMLDivElement>(null)
    const swipeCardRef = useRef<HTMLDivElement>(null)
    const startX = useRef(0)
    const startY = useRef(0)
    const shift = useRef(0)
    const tracking = useRef(false)
    const axis = useRef<'h' | 'v' | null>(null)
    const ignoreClick = useRef(false)
    const locked = useRef(false)
    const SWIPE_OPEN = 72
    const SWIPE_MAX = 88

    const setSwipingClass = (on: boolean) => {
        const wrap = swipeWrapRef.current
        if (!wrap) return
        if (on) wrap.classList.add('is-swiping')
        else wrap.classList.remove('is-swiping')
    }

    const releaseSwipeLock = () => {
        if (!locked.current) return
        locked.current = false
        unlockPageTouch()
        setSwipingClass(false)
    }

    const applyShift = (x: number, animate: boolean) => {
        const card = swipeCardRef.current
        if (!card) return
        card.style.transition = animate ? 'transform 0.22s ease' : 'none'
        card.style.transform = x ? 'translateX(' + x + 'px)' : ''
    }

    const shouldIgnoreSwipe = (target: EventTarget | null) => {
        if (!(target instanceof Element)) return true
        return !!target.closest(
            'a, input, textarea, .student-cross-btn, .student-note'
        )
    }

    const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        if (shouldIgnoreSwipe(event.target)) return
        tracking.current = true
        axis.current = null
        startX.current = event.clientX
        startY.current = event.clientY
        shift.current = 0
        ignoreClick.current = false
        try {
            event.currentTarget.setPointerCapture(event.pointerId)
        } catch (error) {
            // Older browsers without setPointerCapture.
        }
    }

    const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
        if (!tracking.current) return
        const dx = event.clientX - startX.current
        const dy = event.clientY - startY.current
        if (!axis.current) {
            if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return
            axis.current = Math.abs(dx) > Math.abs(dy) * 1.15 ? 'h' : 'v'
            if (axis.current !== 'h' || dx >= 0) {
                tracking.current = false
                axis.current = null
                return
            }
            if (!locked.current) {
                locked.current = true
                lockPageTouch()
                setSwipingClass(true)
            }
        }
        if (axis.current !== 'h') return
        const next = Math.max(-SWIPE_MAX, Math.min(0, dx))
        shift.current = next
        applyShift(next, false)
    }

    const finishSwipe = () => {
        if (!tracking.current && shift.current === 0) {
            axis.current = null
            releaseSwipeLock()
            return
        }
        tracking.current = false
        const opened = axis.current === 'h' && shift.current <= -SWIPE_OPEN
        if (opened) ignoreClick.current = true
        axis.current = null
        applyShift(0, true)
        shift.current = 0
        releaseSwipeLock()
        if (opened) {
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
                navigator.vibrate(10)
            }
            openStudentSms({
                prenom: props.surname,
                nom: props.name,
                classe: props.displayedGroup || String(props.classes || ''),
                crossCounts: props.slots.reduce(
                    (counts, slot) => {
                        counts[slot.type] = crossFilter(
                            slot.type,
                            props.runningPeriode
                        ).length
                        return counts
                    },
                    {} as { [type: string]: number }
                ),
            })
        }
    }

    useEffect(() => {
        return () => releaseSwipeLock()
    }, [])

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
        if (type.indexOf('pos') === 0) return type
        else return '000'
    }
    const newCrossId = (type: string) => {
        return crossIdentifier(type).concat('c').concat(Date.now().toString())
    }
    const handleAddCross = (crossType: string, polarity: CrossPolarity) => {
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
                    polarity,
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
                { type: crossType, polarity, id, time: newDate },
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

    const smsAvailable = !!props.smsAvailable

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
                ref={swipeWrapRef}
                className="sms-swipe w-full"
                onPointerDown={smsAvailable ? onPointerDown : undefined}
                onPointerMove={smsAvailable ? onPointerMove : undefined}
                onPointerUp={smsAvailable ? finishSwipe : undefined}
                onPointerCancel={smsAvailable ? finishSwipe : undefined}
                onClickCapture={
                    smsAvailable
                        ? (event) => {
                              if (!ignoreClick.current) return
                              event.preventDefault()
                              event.stopPropagation()
                              ignoreClick.current = false
                          }
                        : undefined
                }
            >
                {smsAvailable ? (
                    <div className="sms-swipe-rail" aria-hidden="true">
                        SMS
                    </div>
                ) : null}
            <div
                ref={swipeCardRef}
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
                        props.slots.length === 6 ? 'h-38' : ''
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
                                    if (ignoreClick.current) {
                                        ignoreClick.current = false
                                        return
                                    }
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
                            props.slots.length === 6 ? 'mb-6' : ''
                        }`}
                    >
                        {props.slots.map((slot) => (
                            <div
                                key={slot.type}
                                className={`flex ${
                                    props.slots.length === 6
                                        ? 'flex-col items-center'
                                        : 'flex-row items-center'
                                }`}
                            >
                                <CrossButton
                                    src={slot.src}
                                    onAdd={() =>
                                        handleAddCross(slot.type, slot.polarity)
                                    }
                                    onRemove={() => handleRemoveCross(slot.type)}
                                />
                                <div className="student-cross-count">
                                    {
                                        crossFilter(
                                            slot.type,
                                            props.runningPeriode
                                        ).length
                                    }
                                </div>
                            </div>
                        ))}
                    </div>
                    <StudentComment
                            currentUserId={props.currentUser}
                            currentStudentId={props.id}
                            comment={props.comment ? props.comment : ''}
                        />
                </div>
            </div>
            </div>
        </div>
    )
}

export default StudentComponent
