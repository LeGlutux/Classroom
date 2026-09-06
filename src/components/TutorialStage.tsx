import React, { useRef, useState } from 'react'
import addPage from '../images/addPage.png'
import home from '../images/home.png'
import list from '../images/list.png'
import up from '../images/up.png'
import down from '../images/down.png'
import {
    IconChevronRight,
    IconClose,
    IconGrid,
    IconSeatBlank,
    IconUpload,
    IconUser,
    IconUsers,
} from './Icons'
import { handleIcon } from '../functions'
import TutorialDemoCard from './TutorialDemoCard'
import {
    TUTORIAL_NEGATIVE_ICONS,
    TUTORIAL_POSITIVE_ICONS,
    TutorialHighlight,
    TutorialScreen,
} from '../tutorial'
import { seatCaption, CARD_H, CARD_W } from '../seatingPlan'
import { formatListStudentName } from '../utils/listNames'
import { sortStudentsByListColumn } from '../utils/listSort'
import { listStatusClass, ListStatusMark } from './ListStatusButton'

type FakeHighlight = TutorialHighlight

const navIconClass = (active: boolean) =>
    `self-center${active ? '' : ' nav-icon-inactive'}`

const TUTORIAL_PLAN_STUDENTS = [
    { surname: 'Pat', name: 'Mercier' },
    { surname: 'Léa', name: 'Dupont' },
    { surname: 'Léa', name: 'Martin' },
    { surname: 'Noah', name: 'Petit' },
]

const TUTORIAL_LIST_STUDENTS = [
    { id: 'pat', surname: 'Pat', name: 'Mercier' },
    { id: 'lea-d', surname: 'Léa', name: 'Dupont' },
    { id: 'lea-m', surname: 'Léa', name: 'Martin' },
    { id: 'chris', surname: 'Christophe', name: 'Bernard' },
    { id: 'noah', surname: 'Noah', name: 'Petit' },
]

const PLAN_GAP = 8
const PLAN_COL = CARD_W + PLAN_GAP
const PLAN_ROW = CARD_H + PLAN_GAP
const PLAN_AREA_W = PLAN_COL * 3 - PLAN_GAP
const PLAN_AREA_H = PLAN_ROW * 2 - PLAN_GAP

type DemoPlanSeat = {
    id: string
    x: number
    y: number
    student?: { surname: string; name: string }
}

const initialPlanSeats = (): DemoPlanSeat[] => [
    { id: 'pat', x: 0, y: 0, student: TUTORIAL_PLAN_STUDENTS[0] },
    { id: 'lea-d', x: PLAN_COL, y: 0, student: TUTORIAL_PLAN_STUDENTS[1] },
    { id: 'lea-m', x: PLAN_COL * 2, y: 0, student: TUTORIAL_PLAN_STUDENTS[2] },
    { id: 'noah', x: 0, y: PLAN_ROW, student: TUTORIAL_PLAN_STUDENTS[3] },
    { id: 'blank-1', x: PLAN_COL, y: PLAN_ROW },
    { id: 'blank-2', x: PLAN_COL * 2, y: PLAN_ROW },
]

const clampPlanPoint = (x: number, y: number) => ({
    x: Math.max(0, Math.min(x, PLAN_AREA_W - CARD_W)),
    y: Math.max(0, Math.min(y, PLAN_AREA_H - CARD_H)),
})

const TUTORIAL_LIST_START: { [id: string]: number } = {
    pat: 1,
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
}) => (
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
            <FakeRow
                icon={<IconGrid />}
                title="Personnaliser les croix"
                subtitle="Croix négatives et positives"
                lit={highlight === 'crosses-row'}
                onClick={onCrosses}
            />
        </div>
    </div>
)

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
                    <div className="font-studentName ml-2 mt-2 text-gray-900 font-medium text-xl leading-none">
                        Pat
                    </div>
                    <div className="font-studentName ml-2 mt-2 text-gray-900 font-bold text-xl leading-none">
                        Mercier
                    </div>
                </div>
                <div className="w-full h-24 flex p-2 content-center justify-between pr-6">
                    {icons.map((icon) => (
                        <div key={icon} className="flex flex-col">
                            <span className="flex flex-row justify-center mb-1">
                                <img className="h-5 w-5" src={up} alt="" />
                            </span>
                            <div className="w-8 h-8 rounded-full">
                                <img src={handleIcon(icon)} alt="" />
                            </div>
                            <span className="flex flex-row justify-center mt-2">
                                <img className="h-5 w-5" src={down} alt="" />
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
)

const FakeCrosses = ({ highlight }: { highlight?: FakeHighlight }) => (
    <div
        className={`tutorial-fake-body${
            highlight === 'crosses' ? ' tutorial-lit' : ''
        }`}
    >
        <p className="settings-panel-note">
            Croix négatives (oubli de matériel) et croix positives (bonne
            séance).
        </p>
        <FakeCrossBlock title="Croix négatives" icons={TUTORIAL_NEGATIVE_ICONS} />
        <FakeCrossBlock title="Croix positives" icons={TUTORIAL_POSITIVE_ICONS} />
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
    const [seats, setSeats] = useState<DemoPlanSeat[]>(initialPlanSeats)
    const nextBlank = useRef(3)
    const drag = useRef<{
        id: string
        pointerId: number
        grabX: number
        grabY: number
    } | null>(null)
    const [draggingId, setDraggingId] = useState<string | null>(null)
    const planRef = useRef<HTMLDivElement>(null)
    const classmates = TUTORIAL_PLAN_STUDENTS
    const blankCount = seats.filter((seat) => !seat.student).length

    const moveSeat = (id: string, clientX: number, clientY: number) => {
        const area = planRef.current
        const current = drag.current
        if (!area || !current || current.id !== id) return
        const rect = area.getBoundingClientRect()
        const next = clampPlanPoint(
            clientX - rect.left - current.grabX,
            clientY - rect.top - current.grabY
        )
        setSeats((previous) =>
            previous.map((seat) =>
                seat.id === id ? { ...seat, x: next.x, y: next.y } : seat
            )
        )
    }

    const onSeatPointerDown = (
        event: React.PointerEvent<HTMLButtonElement>,
        seat: DemoPlanSeat
    ) => {
        const target = event.target as HTMLElement
        if (target.closest('.seating-blank-remove')) return
        const rect = event.currentTarget.getBoundingClientRect()
        drag.current = {
            id: seat.id,
            pointerId: event.pointerId,
            grabX: event.clientX - rect.left,
            grabY: event.clientY - rect.top,
        }
        setDraggingId(seat.id)
        if (event.currentTarget.setPointerCapture) {
            event.currentTarget.setPointerCapture(event.pointerId)
        }
    }

    const onSeatPointerMove = (
        event: React.PointerEvent<HTMLButtonElement>,
        id: string
    ) => {
        if (!drag.current || drag.current.id !== id) return
        moveSeat(id, event.clientX, event.clientY)
    }

    const onSeatPointerUp = (event: React.PointerEvent<HTMLButtonElement>) => {
        if (drag.current && drag.current.pointerId === event.pointerId) {
            drag.current = null
            setDraggingId(null)
        }
    }

    return (
        <div className="tutorial-fake-body">
            <div
                ref={planRef}
                className="tutorial-fake-plan"
                style={{ width: PLAN_AREA_W, height: PLAN_AREA_H }}
            >
                {seats.map((seat) => (
                    <button
                        type="button"
                        key={seat.id}
                        className={
                            'seating-seat' +
                            (seat.student ? '' : ' is-empty') +
                            (draggingId === seat.id ? ' is-dragging' : '')
                        }
                        style={{
                            width: CARD_W,
                            height: CARD_H,
                            transform:
                                'translate(' + seat.x + 'px, ' + seat.y + 'px)',
                        }}
                        aria-label={
                            seat.student
                                ? seat.student.surname + ' ' + seat.student.name
                                : 'Cadre vide'
                        }
                        onPointerDown={(event) =>
                            onSeatPointerDown(event, seat)
                        }
                        onPointerMove={(event) =>
                            onSeatPointerMove(event, seat.id)
                        }
                        onPointerUp={onSeatPointerUp}
                        onPointerCancel={onSeatPointerUp}
                        onContextMenu={(event) => event.preventDefault()}
                    >
                        {seat.student ? (
                            <FakePlanSeatName
                                student={seat.student}
                                classmates={classmates}
                            />
                        ) : (
                            <span
                                className="seating-blank-remove"
                                role="button"
                                aria-label="Retirer le cadre vide"
                                onPointerDown={(event) =>
                                    event.stopPropagation()
                                }
                                onClick={(event) => {
                                    event.stopPropagation()
                                    setSeats((previous) =>
                                        previous.filter(
                                            (item) => item.id !== seat.id
                                        )
                                    )
                                }}
                            >
                                <IconClose />
                            </span>
                        )}
                    </button>
                ))}
            </div>
            <div className="tutorial-fake-plan-tools">
                <button
                    type="button"
                    className="tutorial-fake-plan-add"
                    aria-label="Ajouter un cadre vide"
                    onClick={() => {
                        if (blankCount >= 4) return
                        const id = 'blank-' + nextBlank.current
                        nextBlank.current += 1
                        setSeats((previous) =>
                            previous.concat({
                                id,
                                x: 0,
                                y: 0,
                            })
                        )
                    }}
                >
                    <IconSeatBlank />
                </button>
            </div>
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
        body = <FakeCrosses highlight={highlight} />
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
