import React, {
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../Auth'
import Firebase from '../firebase'
import NavBar from './NavBar'
import ClassListFilter from './ClassListFilter'
import HomeClassListFilter from './HomeClassListFilter'
import Student from './Student'
import Loader from './Loader'
import { IconLock, IconMinus, IconPlus, IconUnlock } from './Icons'
import addPage from '../images/addPage.png'
import {
    useGroups,
    useIcons,
    usePeriodes,
    useStudents,
} from '../hooks'
import { buildCrossSlots, handleIcon } from '../functions'
import { StudentInterface } from '../interfaces/Student'
import {
    CARD_H,
    CARD_W,
    Point,
    Positions,
    StoredPlans,
    ViewTransform,
    applyDrop,
    findSwapTarget,
    fitView,
    mergePositions,
    parseStoredPlans,
    prunePositions,
    screenToWorld,
    seatLabel,
    snapPosition,
    zoomAround,
} from '../seatingPlan'

const DRAG_THRESHOLD = 8

type DragState = {
    id: string
    origin: Point
    grab: Point
    pointerId: number
    moved: boolean
    startX: number
    startY: number
}

type PanState = {
    pointerId: number
    x: number
    y: number
    ox: number
    oy: number
    moved: boolean
    seatId: string | null
}

const pointerDistance = (
    a: { x: number; y: number },
    b: { x: number; y: number }
) => Math.hypot(a.x - b.x, a.y - b.y)

export default () => {
    const db = Firebase.firestore()
    const { currentUser } = useContext(AuthContext)
    const uid = currentUser ? currentUser.uid : ''
    const { students, loading: studentsLoading, filterStudents } = useStudents(
        uid
    )
    const { groups, loading: groupsLoading } = useGroups(uid)
    const { periodes, runningPeriode } = usePeriodes(uid)
    const userIcons = useIcons(uid)
    const crossSlots = buildCrossSlots(
        userIcons.icons,
        userIcons.positiveIcons
    ).map((slot) => ({
        ...slot,
        src: handleIcon(slot.icon),
    }))

    const [displayedGroup, setDisplayedGroup] = useState('tous')
    const [positions, setPositions] = useState<Positions>({})
    const [locked, setLocked] = useState(false)
    const [view, setView] = useState<ViewTransform>({
        scale: 1,
        offset: { x: 24, y: 24 },
    })
    const [shouldFit, setShouldFit] = useState(false)
    const [swapTarget, setSwapTarget] = useState<string | null>(null)
    const [draggingId, setDraggingId] = useState<string | null>(null)
    const [modalStudent, setModalStudent] = useState<StudentInterface | null>(
        null
    )
    const [plansReady, setPlansReady] = useState(false)

    const canvasRef = useRef<HTMLDivElement>(null)
    const plansRef = useRef<StoredPlans>({})
    const positionsRef = useRef(positions)
    const viewRef = useRef(view)
    const lockedRef = useRef(locked)
    const displayedGroupRef = useRef(displayedGroup)
    const pointersRef = useRef<{ [id: number]: { x: number; y: number } }>({})
    const dragRef = useRef<DragState | null>(null)
    const panRef = useRef<PanState | null>(null)
    const pinchRef = useRef<{ distance: number; scale: number } | null>(null)

    positionsRef.current = positions
    viewRef.current = view
    lockedRef.current = locked
    displayedGroupRef.current = displayedGroup

    const handleHomeClick = () => {
        // On conserve la classe courante en allant à l'accueil.
    }

    const persistPlan = useCallback(
        (classe: string, nextLocked: boolean, nextPositions: Positions) => {
            if (!uid || !classe || classe === 'tous') return
            const ids = Object.keys(nextPositions)
            const pruned = prunePositions(ids, nextPositions)
            const nextPlans: StoredPlans = { ...plansRef.current }
            nextPlans[classe] = { locked: nextLocked, positions: pruned }
            plansRef.current = nextPlans
            db.collection('users')
                .doc(uid)
                .update({ seatingPlans: nextPlans })
                .catch(() => {
                    // hors-ligne / règles : on garde l'état local
                })
        },
        [db, uid]
    )

    useEffect(() => {
        const savedGroup = localStorage.getItem('displayedGroup')
        if (savedGroup) {
            setDisplayedGroup(savedGroup)
        }
    }, [])

    useEffect(() => {
        if (displayedGroup) {
            localStorage.setItem('displayedGroup', displayedGroup)
        }
    }, [displayedGroup])

    useEffect(() => {
        if (
            !groupsLoading &&
            Array.isArray(groups) &&
            groups.length === 1 &&
            displayedGroup === 'tous'
        ) {
            setDisplayedGroup(groups[0])
        }
    }, [groupsLoading, groups, displayedGroup])

    useEffect(() => {
        if (!uid) return
        return db
            .collection('users')
            .doc(uid)
            .onSnapshot((doc) => {
                const data = doc.data()
                plansRef.current = parseStoredPlans(
                    data ? data.seatingPlans : undefined
                )
                setPlansReady(true)
            })
    }, [uid, db])

    useEffect(() => {
        if (studentsLoading) return
        filterStudents(displayedGroup)
    }, [studentsLoading, displayedGroup, filterStudents])

    const classStudents =
        displayedGroup === 'tous'
            ? []
            : students.filter((student) =>
                  student.classes.includes(displayedGroup)
              )
    const seatsReady =
        displayedGroup !== 'tous' &&
        students.every(
            (student) =>
                student.classes && student.classes.includes(displayedGroup)
        )
    const studentIdsKey = classStudents
        .map((student) => student.id)
        .slice()
        .sort()
        .join(',')

    useEffect(() => {
        if (!plansReady || studentsLoading || displayedGroup === 'tous') return
        if (!seatsReady) return
        if (dragRef.current) return
        const ids = classStudents.map((student) => student.id)
        const saved = plansRef.current[displayedGroup]
        const savedPos = saved ? saved.positions : {}
        const merged = mergePositions(ids, savedPos)
        setPositions(merged)
        setLocked(saved ? saved.locked === true : false)
        setSwapTarget(null)
        setDraggingId(null)
        setShouldFit(true)
        const hadNew = ids.some((id) => !savedPos[id])
        if (ids.length > 0 && hadNew) {
            persistPlan(
                displayedGroup,
                saved ? saved.locked === true : false,
                merged
            )
        }
        // classStudents is derived from students + displayedGroup (studentIdsKey)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        plansReady,
        studentsLoading,
        displayedGroup,
        studentIdsKey,
        seatsReady,
        persistPlan,
    ])

    useEffect(() => {
        if (!shouldFit) return
        const el = canvasRef.current
        if (!el) return
        const apply = () => {
            const rect = el.getBoundingClientRect()
            if (rect.width < 8 || rect.height < 8) return false
            const current = positionsRef.current
            if (Object.keys(current).length === 0) return true
            setView(fitView(current, rect.width, rect.height))
            return true
        }
        if (apply()) {
            setShouldFit(false)
            return
        }
        const frame = window.requestAnimationFrame(() => {
            if (apply()) setShouldFit(false)
        })
        return () => window.cancelAnimationFrame(frame)
    }, [shouldFit, displayedGroup, studentIdsKey])

    const canvasPoint = (event: { clientX: number; clientY: number }): Point => {
        const el = canvasRef.current
        if (!el) return { x: event.clientX, y: event.clientY }
        const rect = el.getBoundingClientRect()
        return { x: event.clientX - rect.left, y: event.clientY - rect.top }
    }

    const endPinch = () => {
        pinchRef.current = null
    }

    const finishDrag = () => {
        const drag = dragRef.current
        dragRef.current = null
        setDraggingId(null)
        setSwapTarget(null)
        if (!drag) return
        const classe = displayedGroupRef.current
        const next = applyDrop(
            positionsRef.current,
            drag.id,
            positionsRef.current[drag.id] || drag.origin,
            drag.origin
        )
        setPositions(next)
        persistPlan(classe, lockedRef.current, next)
    }

    const onCanvasPointerDown = (event: React.PointerEvent<HTMLElement>) => {
        if (event.button !== 0 && event.pointerType === 'mouse') return
        pointersRef.current[event.pointerId] = {
            x: event.clientX,
            y: event.clientY,
        }
        const ids = Object.keys(pointersRef.current).map((id) => Number(id))
        if (ids.length >= 2) {
            dragRef.current = null
            panRef.current = null
            setDraggingId(null)
            const a = pointersRef.current[ids[0]]
            const b = pointersRef.current[ids[1]]
            pinchRef.current = {
                distance: pointerDistance(a, b),
                scale: viewRef.current.scale,
            }
            return
        }
        panRef.current = {
            pointerId: event.pointerId,
            x: event.clientX,
            y: event.clientY,
            ox: viewRef.current.offset.x,
            oy: viewRef.current.offset.y,
            moved: false,
            seatId: null,
        }
        try {
            event.currentTarget.setPointerCapture(event.pointerId)
        } catch (err) {
            // ignore
        }
    }

    const onSeatPointerDown = (
        event: React.PointerEvent<HTMLElement>,
        studentId: string
    ) => {
        event.stopPropagation()
        if (event.button !== 0 && event.pointerType === 'mouse') return
        pointersRef.current[event.pointerId] = {
            x: event.clientX,
            y: event.clientY,
        }
        const ids = Object.keys(pointersRef.current).map((id) => Number(id))
        if (ids.length >= 2) {
            dragRef.current = null
            panRef.current = null
            setDraggingId(null)
            const a = pointersRef.current[ids[0]]
            const b = pointersRef.current[ids[1]]
            pinchRef.current = {
                distance: pointerDistance(a, b),
                scale: viewRef.current.scale,
            }
            return
        }
        if (lockedRef.current) {
            panRef.current = {
                pointerId: event.pointerId,
                x: event.clientX,
                y: event.clientY,
                ox: viewRef.current.offset.x,
                oy: viewRef.current.offset.y,
                moved: false,
                seatId: studentId,
            }
            try {
                event.currentTarget.setPointerCapture(event.pointerId)
            } catch (err) {
                // ignore
            }
            return
        }
        const pos = positionsRef.current[studentId]
        if (!pos) return
        const world = screenToWorld(canvasPoint(event), viewRef.current)
        dragRef.current = {
            id: studentId,
            origin: { x: pos.x, y: pos.y },
            grab: { x: world.x - pos.x, y: world.y - pos.y },
            pointerId: event.pointerId,
            moved: false,
            startX: event.clientX,
            startY: event.clientY,
        }
        setDraggingId(studentId)
        try {
            event.currentTarget.setPointerCapture(event.pointerId)
        } catch (err) {
            // ignore
        }
    }

    const onPointerMove = (event: React.PointerEvent<HTMLElement>) => {
        if (pointersRef.current[event.pointerId]) {
            pointersRef.current[event.pointerId] = {
                x: event.clientX,
                y: event.clientY,
            }
        }
        const ids = Object.keys(pointersRef.current).map((id) => Number(id))
        if (ids.length >= 2 && pinchRef.current) {
            const a = pointersRef.current[ids[0]]
            const b = pointersRef.current[ids[1]]
            const dist = pointerDistance(a, b)
            if (dist > 0 && pinchRef.current.distance > 0) {
                const mid = canvasPoint({
                    clientX: (a.x + b.x) / 2,
                    clientY: (a.y + b.y) / 2,
                })
                const nextScale =
                    pinchRef.current.scale * (dist / pinchRef.current.distance)
                setView(zoomAround(viewRef.current, nextScale, mid))
            }
            return
        }
        const drag = dragRef.current
        if (drag && drag.pointerId === event.pointerId) {
            const dist = Math.hypot(
                event.clientX - drag.startX,
                event.clientY - drag.startY
            )
            if (dist > DRAG_THRESHOLD) drag.moved = true
            const world = screenToWorld(canvasPoint(event), viewRef.current)
            const raw = {
                x: world.x - drag.grab.x,
                y: world.y - drag.grab.y,
            }
            const snapped = snapPosition(drag.id, raw, positionsRef.current)
            const next: Positions = { ...positionsRef.current }
            next[drag.id] = snapped
            positionsRef.current = next
            setPositions(next)
            setSwapTarget(findSwapTarget(drag.id, snapped, next))
            return
        }
        const pan = panRef.current
        if (pan && pan.pointerId === event.pointerId) {
            const dx = event.clientX - pan.x
            const dy = event.clientY - pan.y
            if (Math.hypot(dx, dy) > DRAG_THRESHOLD) pan.moved = true
            setView({
                scale: viewRef.current.scale,
                offset: { x: pan.ox + dx, y: pan.oy + dy },
            })
        }
    }

    const onPointerUp = (event: React.PointerEvent<HTMLElement>) => {
        delete pointersRef.current[event.pointerId]
        const remaining = Object.keys(pointersRef.current)
        if (remaining.length < 2) endPinch()
        const drag = dragRef.current
        if (drag && drag.pointerId === event.pointerId) {
            finishDrag()
            return
        }
        const pan = panRef.current
        if (pan && pan.pointerId === event.pointerId) {
            panRef.current = null
            if (!pan.moved && pan.seatId && lockedRef.current) {
                const student = classStudents.find(
                    (item) => item.id === pan.seatId
                )
                if (student) setModalStudent(student)
            }
        }
    }

    useEffect(() => {
        const el = canvasRef.current
        if (!el) return
        const onWheel = (event: WheelEvent) => {
            event.preventDefault()
            const pivot = canvasPoint(event)
            const factor = event.deltaY > 0 ? 0.92 : 1.08
            setView(
                zoomAround(
                    viewRef.current,
                    viewRef.current.scale * factor,
                    pivot
                )
            )
        }
        el.addEventListener('wheel', onWheel, { passive: false })
        return () => el.removeEventListener('wheel', onWheel)
    }, [displayedGroup, studentIdsKey])

    const zoomBy = (factor: number) => {
        const el = canvasRef.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        setView(
            zoomAround(viewRef.current, viewRef.current.scale * factor, {
                x: rect.width / 2,
                y: rect.height / 2,
            })
        )
    }

    const toggleLock = () => {
        const next = !locked
        setLocked(next)
        persistPlan(displayedGroup, next, positionsRef.current)
        setModalStudent(null)
    }

    const title =
        displayedGroup === 'tous' ? 'Plan de classe' : displayedGroup

    if (currentUser === null) return <div />

    if (studentsLoading || groupsLoading || !plansReady) {
        return (
            <div className="w-full h-screen flex flex-col justify-center items-center app-bg">
                <div className="flex flex-row w-full h-12 page-header items-center justify-center">
                    <span className="page-header-title">{title}</span>
                </div>
                <div className="h-full flex flex-col justify-center items-center">
                    <div className="empty-state">
                        <div className="empty-title">Chargement des données</div>
                    </div>
                    <Loader />
                </div>
                <div className="w-full h-12 nav-wrap sticky bottom-0">
                    <NavBar activeMenu="plan" onHomeClick={handleHomeClick} />
                </div>
            </div>
        )
    }

    if (groups.length === 0) {
        return (
            <div className="w-full h-screen flex flex-col justify-center items-center app-bg">
                <div className="flex flex-row w-full h-12 page-header items-center justify-center">
                    <span className="page-header-title">Plan de classe</span>
                </div>
                <div className="h-full flex flex-col justify-center items-center">
                    <div className="empty-state">
                        <div className="empty-title">Aucune classe</div>
                        <div className="empty-text">
                            Ajoutez une classe pour composer un plan :
                        </div>
                    </div>
                    <div>
                        <Link to="/create">
                            <img className="self-center" src={addPage} alt="" />
                        </Link>
                    </div>
                </div>
                <div className="w-full h-12 nav-wrap sticky bottom-0">
                    <NavBar activeMenu="plan" onHomeClick={handleHomeClick} />
                </div>
            </div>
        )
    }

    const showClassFilter =
        groups.length !== 1 && displayedGroup !== 'tous'

    return (
        <div className="w-full h-screen flex flex-col overflow-hidden app-bg">
            <div className="flex-shrink-0 relative flex flex-row w-full h-12 page-header items-center justify-center">
                <span className="page-header-title seating-page-title">
                    {title}
                </span>
                {displayedGroup !== 'tous' && (
                    <button
                        type="button"
                        className={`seating-lock${locked ? ' is-on' : ''}`}
                        onClick={toggleLock}
                        aria-label={
                            locked
                                ? 'Déverrouiller le plan'
                                : 'Verrouiller le plan'
                        }
                        aria-pressed={locked}
                    >
                        {locked ? <IconLock /> : <IconUnlock />}
                    </button>
                )}
            </div>

            {displayedGroup === 'tous' && (
                <div className="flex-1 min-h-0 flex w-full flex-col overflow-hidden py-2">
                    <HomeClassListFilter
                        setDisplayedGroup={setDisplayedGroup}
                        onFilter={(group) => {
                            filterStudents(group)
                        }}
                        closeMenu={() => undefined}
                        groups={groups}
                        display={() => false}
                    />
                </div>
            )}

            {displayedGroup !== 'tous' && !seatsReady && (
                <div className="flex-1 min-h-0 flex w-full flex-col items-center justify-center">
                    <Loader />
                </div>
            )}

            {displayedGroup !== 'tous' &&
                seatsReady &&
                classStudents.length === 0 && (
                <div className="flex-1 min-h-0 flex w-full flex-col items-center justify-center">
                    <div className="empty-state">
                        <div className="empty-title">Aucun élève</div>
                        <div className="empty-text">
                            Cette classe n’a pas encore d’élèves.
                        </div>
                    </div>
                    <Link to="/create">
                        <img className="self-center" src={addPage} alt="" />
                    </Link>
                </div>
            )}

            {displayedGroup !== 'tous' &&
                seatsReady &&
                classStudents.length > 0 && (
                <div
                    ref={canvasRef}
                    className="seating-canvas"
                    onPointerDown={onCanvasPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    onPointerCancel={onPointerUp}
                >
                    <div
                        className="seating-world"
                        style={{
                            transform:
                                'translate(' +
                                view.offset.x +
                                'px, ' +
                                view.offset.y +
                                'px) scale(' +
                                view.scale +
                                ')',
                        }}
                    >
                        {classStudents.map((student) => {
                            const pos = positions[student.id]
                            if (!pos) return null
                            const isDragging = draggingId === student.id
                            const isSwap = swapTarget === student.id
                            return (
                                <button
                                    type="button"
                                    key={student.id}
                                    className={
                                        'seating-seat' +
                                        (locked ? ' is-locked' : '') +
                                        (isDragging ? ' is-dragging' : '') +
                                        (isSwap ? ' is-swap' : '')
                                    }
                                    style={{
                                        transform:
                                            'translate(' +
                                            pos.x +
                                            'px, ' +
                                            pos.y +
                                            'px)',
                                        width: CARD_W,
                                        height: CARD_H,
                                    }}
                                    onPointerDown={(event) =>
                                        onSeatPointerDown(event, student.id)
                                    }
                                    onPointerMove={onPointerMove}
                                    onPointerUp={onPointerUp}
                                    onPointerCancel={onPointerUp}
                                    onContextMenu={(event) =>
                                        event.preventDefault()
                                    }
                                >
                                    <span className="seating-seat-name">
                                        {seatLabel(student.surname)}
                                    </span>
                                </button>
                            )
                        })}
                    </div>
                    <div
                        className={
                            'seating-zoom' +
                            (showClassFilter ? '' : ' is-flush')
                        }
                    >
                        <button
                            type="button"
                            aria-label="Zoom avant"
                            onClick={() => zoomBy(1.15)}
                            onPointerDown={(event) => event.stopPropagation()}
                        >
                            <IconPlus />
                        </button>
                        <button
                            type="button"
                            aria-label="Zoom arrière"
                            onClick={() => zoomBy(1 / 1.15)}
                            onPointerDown={(event) => event.stopPropagation()}
                        >
                            <IconMinus />
                        </button>
                    </div>
                </div>
            )}

            {showClassFilter && (
                <ClassListFilter
                    setDisplayedGroup={setDisplayedGroup}
                    onFilter={(group) => {
                        filterStudents(group)
                    }}
                    closeMenu={() => undefined}
                    groups={groups}
                />
            )}

            {modalStudent && (
                <div
                    className="modal-overlay"
                    onClick={() => setModalStudent(null)}
                >
                    <div
                        className="modal-card seating-student-modal"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="seating-student-modal-inner">
                            <Student
                                displayedStudents={[modalStudent]}
                                periodes={periodes}
                                runningPeriode={runningPeriode}
                                currentUser={currentUser.uid}
                                loading={false}
                                currentUserId={currentUser.uid}
                                selected={modalStudent.selected}
                                classes={
                                    modalStudent.classes &&
                                    modalStudent.classes[0]
                                        ? modalStudent.classes[0]
                                        : displayedGroup
                                }
                                name={modalStudent.name}
                                surname={modalStudent.surname}
                                comment={
                                    modalStudent.comment
                                        ? modalStudent.comment
                                        : ''
                                }
                                id={modalStudent.id}
                                highlight={modalStudent.highlight}
                                toggleSelected={() => undefined}
                                toggleHighlight={() => undefined}
                                refresher={(group) => filterStudents(group)}
                                displayedGroup={displayedGroup}
                                slots={crossSlots}
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className="flex-shrink-0 w-full h-12 nav-wrap">
                <NavBar activeMenu="plan" onHomeClick={handleHomeClick} />
            </div>
        </div>
    )
}
