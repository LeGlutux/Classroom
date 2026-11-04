import React, { useEffect, useRef, useState } from 'react'
import addPage from '../images/addPage.png'
import home from '../images/home.png'
import list from '../images/list.png'
import up from '../images/up.png'
import down from '../images/down.png'
import {
    IconCalendar,
    IconChat,
    IconChevronRight,
    IconClose,
    IconDrop,
    IconGrid,
    IconLock,
    IconSeatBlank,
    IconTrash,
    IconTrophy,
    IconUnlock,
    IconUpload,
    IconUser,
    IconUsers,
} from './Icons'
import { handleIcon } from '../functions'
import TutorialDemoCard from './TutorialDemoCard'
import {
    TUTORIAL_CLASS,
    TUTORIAL_DEMO_STUDENT,
    TUTORIAL_LIST_STUDENTS,
    TUTORIAL_NEGATIVE_ICONS,
    TUTORIAL_POSITIVE_ICONS,
    TutorialHighlight,
    TutorialScreen,
} from '../tutorial'
import { SESSION_FOLLOW_OPTIONS } from '../sessionFollow'
import {
    addEmptySeat,
    applyDrop,
    boundingBox,
    CARD_H,
    CARD_W,
    CLUSTER_OUTLINE,
    findSwapTarget,
    isEmptySeatId,
    LAYOUT_PAD,
    linkedSeatGroups,
    pairedTableLayout,
    Positions,
    removeSeat,
    seatCaption,
    snapPosition,
} from '../seatingPlan'
import { formatListStudentName } from '../utils/listNames'
import { sortStudentsByListColumn } from '../utils/listSort'
import { listStatusClass, ListStatusMark } from './ListStatusButton'

type FakeHighlight = TutorialHighlight

const navIconClass = (active: boolean) =>
    `self-center${active ? '' : ' nav-icon-inactive'}`

const TUTORIAL_LIST_START: { [id: string]: number } = {
    amandine: 1,
    'lea-d': 0,
    'lea-m': 2,
    chris: 3,
    noah: 0,
}

const FakeNav = ({
    active,
    highlight,
    onSettings,
    onPlan,
    onLists,
}: {
    active: 'home' | 'settings' | 'plan' | 'lists'
    highlight?: FakeHighlight
    onSettings?: () => void
    onPlan?: () => void
    onLists?: () => void
}) => (
    <div className="flex flex-row px-4 h-full justify-around py-2">
        <button
            type="button"
            className={`rounded-full h-8 w-8 flex justify-center items-center tutorial-fake-nav-btn${
                highlight === 'nav-settings' ? ' tutorial-lit' : ''
            }`}
            onClick={onSettings}
            aria-label="Paramètres"
        >
            <img
                className={navIconClass(active === 'settings')}
                src={addPage}
                alt=""
            />
        </button>
        <span className="rounded-full h-8 w-8 flex justify-center items-center">
            <img
                className={navIconClass(active === 'home')}
                src={home}
                alt=""
            />
        </span>
        <button
            type="button"
            className={`rounded-full h-8 w-8 flex justify-center items-center tutorial-fake-nav-btn${
                highlight === 'nav-plan' ? ' tutorial-lit' : ''
            }`}
            onClick={onPlan}
            aria-label="Plan de classe"
        >
            <IconGrid
                className={`tn-icon nav-plan-icon${
                    active === 'plan' ? '' : ' nav-icon-inactive'
                }`}
            />
        </button>
        <button
            type="button"
            className={`rounded-full h-8 w-8 flex justify-center items-center tutorial-fake-nav-btn${
                highlight === 'nav-lists' ? ' tutorial-lit' : ''
            }`}
            onClick={onLists}
            aria-label="Listes"
        >
            <img
                className={navIconClass(active === 'lists')}
                src={list}
                alt=""
            />
        </button>
    </div>
)

const FakeRow = ({
    icon,
    title,
    subtitle,
    lit,
    onClick,
}: {
    icon: React.ReactNode
    title: string
    subtitle: string
    lit?: boolean
    onClick?: () => void
}) => {
    const className = `settings-row${lit ? ' tutorial-lit' : ''}`
    const content = (
        <React.Fragment>
            <span className="settings-row-icon">{icon}</span>
            <span className="settings-row-body">
                <span className="settings-row-title">{title}</span>
                <span className="settings-row-sub">{subtitle}</span>
            </span>
            <IconChevronRight className="settings-row-chevron" />
        </React.Fragment>
    )
    if (onClick) {
        return (
            <button type="button" className={className} onClick={onClick}>
                {content}
            </button>
        )
    }
    return <div className={className}>{content}</div>
}

const FakeSettings = ({
    highlight,
    onCrosses,
}: {
    highlight?: FakeHighlight
    onCrosses?: () => void
}) => {
    const periodesRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (highlight !== 'periodes') return
        const node = periodesRef.current
        if (!node || !node.scrollIntoView) return
        node.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }, [highlight])

    return (
        <div className="tutorial-fake-body">
            <div className="settings-group-label">Classes et élèves</div>
            <div className="settings-group">
                <div className={highlight === 'classes' ? 'tutorial-lit' : ''}>
                    <FakeRow
                        icon={<IconUpload />}
                        title="Importer depuis Pronote"
                        subtitle="À partir d’un export CSV"
                    />
                    <FakeRow
                        icon={<IconUsers />}
                        title="Créer une classe manuellement"
                        subtitle="Une classe à la fois"
                    />
                    <FakeRow
                        icon={<IconUser />}
                        title="Ajouter des élèves manuellement"
                        subtitle="Un élève à la fois, dans une classe"
                    />
                </div>
            </div>
            <div className="settings-group-label">Personnalisation</div>
            <div className="settings-group">
                <FakeRow
                    icon={<IconGrid />}
                    title="Personnaliser les croix"
                    subtitle="Croix négatives et positives"
                    lit={highlight === 'crosses-row'}
                    onClick={onCrosses}
                />
                <FakeRow
                    icon={<IconDrop />}
                    title="Personnaliser les couleurs élèves"
                    subtitle="Selon les notes de fiche (PAP, PAI…)"
                />
                <FakeRow
                    icon={<IconChat />}
                    title="Personnaliser les SMS"
                    subtitle="Modifier les modèles de SMS à envoyer aux parents"
                />
            </div>
            <div className="settings-group-label">Suivi</div>
            <div className="settings-group">
                <FakeRow
                    icon={<IconTrophy />}
                    title="Statistiques et podium"
                    subtitle="Croix par classe et meilleurs élèves"
                />
            </div>
            <div className="settings-group-label">Année</div>
            <div className="settings-group">
                <div
                    ref={periodesRef}
                    className={highlight === 'periodes' ? 'tutorial-lit' : ''}
                >
                    <FakeRow
                        icon={<IconCalendar />}
                        title="Périodes"
                        subtitle="Changer de période ou en commencer une nouvelle"
                    />
                </div>
                <FakeRow
                    icon={<IconTrash />}
                    title="Réinitialiser l’année"
                    subtitle="Supprimer classes, élèves et listes"
                />
            </div>
        </div>
    )
}

const FakeCrossBlock = ({
    title,
    icons,
}: {
    title: string
    icons: number[]
}) => (
    <div className="cross-customize-block">
        <div className="settings-group-label">{title}</div>
        <div className="student-card cross-customize-card">
            <div className="flex justify-between flex-col">
                <div className="flex flex-row">
                    <div className="font-studentName ml-2 mt-1 text-gray-900 font-medium leading-none">
                        {TUTORIAL_DEMO_STUDENT.surname}
                    </div>
                    <div className="font-studentName ml-2 mt-1 text-gray-900 font-bold leading-none">
                        {TUTORIAL_DEMO_STUDENT.name}
                    </div>
                </div>
                <div className="w-full tutorial-cross-icons flex items-center justify-center">
                    {icons.map((icon) => (
                        <div key={icon} className="flex flex-col">
                            <span className="flex flex-row justify-center mb-0.5">
                                <img className="tutorial-cross-arrow" src={up} alt="" />
                            </span>
                            <div className="tutorial-cross-icon rounded-full">
                                <img src={handleIcon(icon)} alt="" />
                            </div>
                            <span className="flex flex-row justify-center mt-1">
                                <img className="tutorial-cross-arrow" src={down} alt="" />
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
)

const FakeCrosses = () => (
    <div className="tutorial-fake-body tutorial-fake-crosses">
        <p className="settings-panel-note">
            Croix négatives (oubli de matériel) et croix positives (bonne
            séance).
        </p>
        <FakeCrossBlock title="Croix négatives" icons={TUTORIAL_NEGATIVE_ICONS} />
        <FakeCrossBlock title="Croix positives" icons={TUTORIAL_POSITIVE_ICONS} />
        <div className="session-follow-field">
            <div className="settings-group-label">
                Durée du suivi des croix
            </div>
            <div className="session-follow-options">
                {SESSION_FOLLOW_OPTIONS.map((option) => (
                    <span
                        key={option.value}
                        className={`session-follow-chip${
                            option.value === '120' ? ' is-on' : ''
                        }`}
                    >
                        {option.shortLabel}
                    </span>
                ))}
            </div>
        </div>
    </div>
)

const FakeHome = ({
    highlight,
    demo,
}: {
    highlight?: FakeHighlight
    demo?: 'card' | 'swipe'
}) => (
    <div className="tutorial-fake-body">
        {demo ? (
            <TutorialDemoCard
                swipe={demo === 'swipe'}
                interactive={highlight === 'demo-cross' || highlight === 'demo-note'}
                focus={
                    highlight === 'demo-i' ||
                    highlight === 'demo-cross' ||
                    highlight === 'demo-note' ||
                    highlight === 'demo-card'
                        ? highlight
                        : undefined
                }
            />
        ) : (
            <div className="tutorial-fake-home-empty">
                <div className="empty-title">Accueil</div>
                <div className="empty-text">
                    Vos classes apparaîtront ici, une fois créées.
                </div>
            </div>
        )}
    </div>
)

const FakePlanSeatName = ({
    student,
    classmates,
}: {
    student: { surname: string; name: string }
    classmates: { surname: string }[]
}) => {
    const caption = seatCaption(student, classmates)
    const hasSecond = !!(caption.line2 || caption.hint)
    return (
        <span className="seating-seat-name">
            <span className="seating-seat-line">{caption.line1}</span>
            {hasSecond ? (
                <span className="seating-seat-line seating-seat-line-split">
                    {caption.line2 ? (
                        <span className="seating-seat-tail">{caption.line2}</span>
                    ) : null}
                    {caption.hint ? (
                        <span className="seating-seat-hint">{caption.hint}</span>
                    ) : null}
                </span>
            ) : null}
        </span>
    )
}

const FakePlan = () => {
    const classmates = TUTORIAL_CLASS
    const [positions, setPositions] = useState<Positions>(() =>
        pairedTableLayout(TUTORIAL_CLASS.map((student) => student.id))
    )
    const [locked, setLocked] = useState(false)
    const [openId, setOpenId] = useState<string | null>(null)
    const [draggingId, setDraggingId] = useState<string | null>(null)
    const [swapTarget, setSwapTarget] = useState<string | null>(null)
    const positionsRef = useRef(positions)
    const dragRef = useRef<{
        id: string
        dx: number
        dy: number
        moved: boolean
        origin: { x: number; y: number }
    } | null>(null)
    positionsRef.current = positions

    const byId: { [id: string]: { surname: string; name: string } } = {}
    TUTORIAL_CLASS.forEach((student) => {
        byId[student.id] = student
    })

    const box = boundingBox(positions)
    const canvasH = Math.max(box.y + box.h + LAYOUT_PAD * 2, 320)
    const canvasW = Math.max(box.x + box.w + LAYOUT_PAD * 2, 360)
    const clusterSvgW = Math.max(
        1,
        box.x + box.w + CLUSTER_OUTLINE * 6
    )
    const clusterSvgH = Math.max(
        1,
        box.y + box.h + CLUSTER_OUTLINE * 6
    )
    const seatClusters = linkedSeatGroups(positions)
    const ghost = draggingId ? dragRef.current : null

    const onSeatPointerDown = (
        event: React.PointerEvent<HTMLButtonElement>,
        id: string
    ) => {
        if (locked) return
        event.preventDefault()
        event.stopPropagation()
        const pos = positionsRef.current[id]
        if (!pos) return
        dragRef.current = {
            id,
            dx: event.clientX - pos.x,
            dy: event.clientY - pos.y,
            moved: false,
            origin: { x: pos.x, y: pos.y },
        }
        setDraggingId(id)
        try {
            event.currentTarget.setPointerCapture(event.pointerId)
        } catch (error) {
            // ignore
        }
    }

    const onSeatPointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
        const drag = dragRef.current
        if (!drag) return
        const raw = {
            x: event.clientX - drag.dx,
            y: event.clientY - drag.dy,
        }
        if (
            Math.abs(raw.x - drag.origin.x) > 6 ||
            Math.abs(raw.y - drag.origin.y) > 6
        ) {
            drag.moved = true
        }
        if (!drag.moved) return
        const snapped = snapPosition(drag.id, raw, positionsRef.current)
        const next = {
            ...positionsRef.current,
            [drag.id]: { ...positionsRef.current[drag.id], ...snapped },
        }
        positionsRef.current = next
        setPositions(next)
        setSwapTarget(findSwapTarget(drag.id, snapped, next))
    }

    const onSeatPointerUp = () => {
        const drag = dragRef.current
        if (drag && drag.moved) {
            const dropped = positionsRef.current[drag.id]
            if (dropped) {
                const next = applyDrop(
                    positionsRef.current,
                    drag.id,
                    dropped,
                    drag.origin
                )
                positionsRef.current = next
                setPositions(next)
            }
        }
        dragRef.current = null
        setDraggingId(null)
        setSwapTarget(null)
    }

    const openStudent = openId ? byId[openId] : null

    return (
        <div className="tutorial-fake-body tutorial-fake-plan-body">
            <div className="tutorial-plan-tools">
                {locked ? null : (
                    <button
                        type="button"
                        className="seating-add-blank"
                        aria-label="Ajouter un cadre vide"
                        onClick={() =>
                            setPositions((current) => {
                                const box = boundingBox(current)
                                return addEmptySeat(current, {
                                    x: LAYOUT_PAD,
                                    y: box.y + box.h,
                                })
                            })
                        }
                    >
                        <IconSeatBlank />
                    </button>
                )}
                <button
                    type="button"
                    className={`seating-lock${locked ? ' is-on' : ''}`}
                    onClick={() => setLocked((value) => !value)}
                    aria-label={
                        locked ? 'Déverrouiller le plan' : 'Verrouiller le plan'
                    }
                    aria-pressed={locked}
                >
                    {locked ? <IconLock /> : <IconUnlock />}
                </button>
            </div>
            <div
                className="tutorial-fake-plan"
                style={{ width: canvasW, height: canvasH }}
            >
                <svg
                    className="seating-clusters"
                    width={clusterSvgW}
                    height={clusterSvgH}
                >
                    {seatClusters.map((ids) => (
                        <g key={ids.slice().sort().join('-')}>
                            {ids.map((id) => {
                                const pos = positions[id]
                                if (!pos) return null
                                return (
                                    <rect
                                        key={'o-' + id}
                                        x={pos.x - CLUSTER_OUTLINE}
                                        y={pos.y - CLUSTER_OUTLINE}
                                        width={CARD_W + CLUSTER_OUTLINE * 2}
                                        height={CARD_H + CLUSTER_OUTLINE * 2}
                                        rx="3"
                                        fill="#18181b"
                                    />
                                )
                            })}
                            {ids.map((id) => {
                                const pos = positions[id]
                                if (!pos) return null
                                return (
                                    <rect
                                        key={'f-' + id}
                                        x={pos.x - 1}
                                        y={pos.y - 1}
                                        width={CARD_W + 2}
                                        height={CARD_H + 2}
                                        rx="2"
                                        fill="#fff"
                                    />
                                )
                            })}
                        </g>
                    ))}
                </svg>
                {ghost && ghost.origin ? (
                    <div
                        className={
                            'seating-seat is-ghost' +
                            (isEmptySeatId(ghost.id) ? ' is-empty' : '')
                        }
                        style={{
                            transform:
                                'translate(' +
                                ghost.origin.x +
                                'px, ' +
                                ghost.origin.y +
                                'px)',
                            width: CARD_W,
                            height: CARD_H,
                        }}
                        aria-hidden="true"
                    />
                ) : null}
                {Object.keys(positions).map((id) => {
                    const pos = positions[id]
                    if (!pos) return null
                    const empty = isEmptySeatId(id)
                    const student = empty ? null : byId[id]
                    const label = empty
                        ? 'Cadre vide'
                        : student
                          ? student.surname + ' ' + student.name
                          : id
                    return (
                        <button
                            type="button"
                            key={id}
                            className={
                                'seating-seat' +
                                (empty ? ' is-empty' : '') +
                                (locked ? ' is-locked' : '') +
                                (draggingId === id ? ' is-dragging' : '') +
                                (swapTarget === id ? ' is-swap' : '')
                            }
                            style={{
                                transform:
                                    'translate(' + pos.x + 'px, ' + pos.y + 'px)',
                                width: CARD_W,
                                height: CARD_H,
                            }}
                            aria-label={label}
                            onPointerDown={(event) =>
                                onSeatPointerDown(event, id)
                            }
                            onPointerMove={onSeatPointerMove}
                            onPointerUp={onSeatPointerUp}
                            onPointerCancel={onSeatPointerUp}
                            onClick={() => {
                                if (empty) return
                                if (!locked) return
                                if (dragRef.current && dragRef.current.moved)
                                    return
                                setOpenId(id)
                            }}
                        >
                            {empty ? null : student ? (
                                <FakePlanSeatName
                                    student={student}
                                    classmates={classmates}
                                />
                            ) : null}
                            {empty && !locked ? (
                                <span
                                    className="seating-blank-remove"
                                    onClick={(event) => {
                                        event.stopPropagation()
                                        setPositions((current) =>
                                            removeSeat(current, id)
                                        )
                                    }}
                                    aria-label="Supprimer le cadre vide"
                                >
                                    <IconClose />
                                </span>
                            ) : null}
                        </button>
                    )
                })}
            </div>
            {openStudent ? (
                <div
                    className="tutorial-plan-card-overlay"
                    onClick={() => setOpenId(null)}
                >
                    <div
                        className="tutorial-plan-card"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="seating-modal-close"
                            onClick={() => setOpenId(null)}
                            aria-label="Fermer"
                        >
                            <IconClose />
                        </button>
                        <TutorialDemoCard
                            surname={openStudent.surname}
                            name={openStudent.name}
                            interactive
                        />
                    </div>
                </div>
            ) : null}
        </div>
    )
}

const DemoListStatus = ({
    state,
    onChange,
}: {
    state: number
    onChange: (next: number) => void
}) => {
    const longPress = useRef(false)
    const timer = useRef<number | null>(null)

    const start = () => {
        longPress.current = false
        timer.current = window.setTimeout(() => {
            longPress.current = true
            onChange(0)
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
            className={`list-status ${listStatusClass(state)}`}
            onPointerDown={start}
            onPointerUp={cancel}
            onPointerLeave={cancel}
            onPointerCancel={cancel}
            onContextMenu={(event) => event.preventDefault()}
            onClick={() => {
                if (longPress.current) {
                    longPress.current = false
                    return
                }
                onChange(state >= 3 ? 0 : state + 1)
            }}
        >
            <ListStatusMark state={state} />
        </button>
    )
}

const FakeList = () => {
    const [states, setStates] = useState<{ [id: string]: number }>(
        TUTORIAL_LIST_START
    )
    const [sorted, setSorted] = useState(false)
    const classmates = TUTORIAL_LIST_STUDENTS
    const statesById: { [id: string]: number[] } = {}
    TUTORIAL_LIST_STUDENTS.forEach((student) => {
        statesById[student.id] = [states[student.id] || 0]
    })
    const ordered = sorted
        ? sortStudentsByListColumn(TUTORIAL_LIST_STUDENTS, 0, statesById)
        : TUTORIAL_LIST_STUDENTS

    return (
        <div className="tutorial-fake-body tutorial-fake-list-body">
            <div className="tutorial-fake-list">
                <div
                    className="flex flex-row h-auto bg-white rounded-lg border overflow-hidden box-border"
                    style={{ borderColor: 'var(--tn-line)' }}
                >
                    <div
                        className="list-col-head flex items-center justify-center w-7/12 border-r py-3 px-2 box-border"
                        style={{ borderColor: 'var(--tn-line)' }}
                    >
                        Nom
                    </div>
                    <button
                        type="button"
                        className={`list-col-head list-col-head-item flex justify-center items-center w-5/12 py-3 box-border${
                            sorted ? ' is-sorted' : ''
                        }`}
                        onClick={() => setSorted((value) => !value)}
                        aria-pressed={sorted}
                        aria-label={
                            sorted
                                ? 'Revenir à l’ordre alphabétique'
                                : 'Trier par Signé'
                        }
                    >
                        Signé
                    </button>
                </div>
                {ordered.map((student) => (
                    <div
                        key={student.id}
                        className="bg-white rounded-lg overflow-hidden mt-1"
                        style={{ border: '1px solid var(--tn-line)' }}
                    >
                        <div className="flex flex-row w-full h-12 items-center box-border">
                            <div className="list-student-name w-7/12 border-r-2 border-gray-200 font-studentName text-gray-800 box-border">
                                {formatListStudentName(student, classmates)}
                            </div>
                            <div className="flex w-5/12 h-full flex-shrink-0 box-border">
                                <DemoListStatus
                                    state={states[student.id] || 0}
                                    onChange={(next) =>
                                        setStates((previous) => ({
                                            ...previous,
                                            [student.id]: next,
                                        }))
                                    }
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

const stageHeader = (stage: TutorialScreen) => {
    if (stage === 'settings') return 'Paramètres'
    if (stage === 'crosses') return 'Personnaliser les croix'
    if (stage === 'plan') return 'Plan de classe'
    if (stage === 'lists') return 'Évaluation'
    return 'Accueil'
}

const navActiveFor = (
    stage: TutorialScreen
): 'home' | 'settings' | 'plan' | 'lists' => {
    if (stage === 'plan') return 'plan'
    if (stage === 'lists') return 'lists'
    if (stage === 'home') return 'home'
    return 'settings'
}

const TutorialFakeApp = ({
    stage,
    highlight,
    demo,
    onAdvance,
    children,
}: {
    stage: TutorialScreen
    highlight?: FakeHighlight
    demo?: 'card' | 'swipe'
    onAdvance: () => void
    children?: React.ReactNode
}) => {
    const header = stageHeader(stage)
    const navActive = navActiveFor(stage)

    let body: React.ReactNode
    if (stage === 'settings') {
        body = (
            <FakeSettings
                highlight={highlight}
                onCrosses={highlight === 'crosses-row' ? onAdvance : undefined}
            />
        )
    } else if (stage === 'crosses') {
        body = <FakeCrosses />
    } else if (stage === 'plan') {
        body = <FakePlan />
    } else if (stage === 'lists') {
        body = <FakeList />
    } else {
        body = <FakeHome highlight={highlight} demo={demo} />
    }

    return (
        <div className="tutorial-stage">
            <div className="flex-shrink-0 relative flex flex-row w-full h-12 page-header items-center justify-center">
                <span className="page-header-title">{header}</span>
            </div>
            {body}
            {children}
            <div className="flex-shrink-0 w-full h-12 nav-wrap">
                <FakeNav
                    active={navActive}
                    highlight={highlight}
                    onSettings={
                        highlight === 'nav-settings' ? onAdvance : undefined
                    }
                    onPlan={highlight === 'nav-plan' ? onAdvance : undefined}
                    onLists={highlight === 'nav-lists' ? onAdvance : undefined}
                />
            </div>
        </div>
    )
}

export default TutorialFakeApp
