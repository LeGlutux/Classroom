import React, { useContext, useMemo, useState } from 'react'
import firebase from 'firebase/app'
import {
    useGroups,
    usePeriodes,
    useStudents,
    useCrosses,
    useIcons,
} from '../hooks'
import { AuthContext } from '../Auth'
import SettingsLayout from './SettingsLayout'
import {
    CrossPolarity,
    PERIOD_YEAR,
    buildCrossSlots,
    crossInSelectedPeriod,
    handleIcon,
    isPositiveCross,
    studentInClass,
} from '../functions'
import {
    ClassCrossStats,
    SlotDelta,
    compareBySlotCount,
    computeClassCrossStats,
    countSlotMatches,
    diffSlotCounts,
    formatDelta,
    previousPeriodNumber,
} from '../utils/classCrossStats'

type RankedStudent = {
    id: string
    name: string
    surname: string
    negatives: number
    positives: number
    slotCount: number
}

const readStoredInt = (key: string, fallback: number) => {
    try {
        const n = Number(window.localStorage.getItem(key))
        if (Number.isFinite(n) && n >= 0 && n <= 6) return n
    } catch (e) {
        // ignore
    }
    return fallback
}

const readStoredSlotType = () => {
    try {
        return window.localStorage.getItem('podiumRankSlot') || ''
    } catch (e) {
        return ''
    }
}

const persistValue = (key: string, value: string) => {
    try {
        window.localStorage.setItem(key, value)
    } catch (e) {
        // ignore
    }
}

const ClassStatsBlock = ({
    stats,
    slotDeltas,
    previousLabel,
    selectedType,
    onSelectType,
}: {
    stats: ClassCrossStats
    slotDeltas: SlotDelta[] | null
    previousLabel: string | null
    selectedType: string
    onSelectType: (type: string) => void
}) => {
    const avg =
        stats.studentCount > 0
            ? (stats.total / stats.studentCount).toFixed(1).replace('.', ',')
            : '0'
    const deltaByType: { [type: string]: SlotDelta } = {}
    ;(slotDeltas || []).forEach((slot) => {
        deltaByType[slot.type] = slot
    })

    return (
        <div className="podium-stats">
            <div className="podium-stats-label">Statistiques</div>
            <div className="podium-stats-totals">
                <span>
                    {stats.total} croix
                    {stats.studentCount > 0 ? ' · moy. ' + avg + '/élève' : ''}
                </span>
                <span className="podium-scores">
                    <span className="podium-neg">{stats.negatives}</span>
                    <span className="podium-pos">{stats.positives}</span>
                </span>
            </div>
            {stats.bySlot.length > 0 ? (
                <div
                    className="podium-stats-types"
                    aria-label="Croix par type"
                >
                    {stats.bySlot.map((slot) => {
                        const delta = deltaByType[slot.type]
                        const selected = selectedType === slot.type
                        return (
                            <button
                                type="button"
                                key={slot.type}
                                className={
                                    'podium-stats-type' +
                                    (slot.polarity === 'positive'
                                        ? ' is-pos'
                                        : ' is-neg') +
                                    (selected ? ' is-on' : '')
                                }
                                aria-pressed={selected}
                                onClick={() =>
                                    onSelectType(selected ? '' : slot.type)
                                }
                            >
                                {slot.src && slot.src !== 'none' ? (
                                    <img src={slot.src} alt="" />
                                ) : null}
                                <span>{slot.count}</span>
                                {delta && delta.delta !== 0 ? (
                                    <span
                                        className={
                                            'podium-stats-delta' +
                                            (delta.delta > 0
                                                ? ' is-up'
                                                : ' is-down')
                                        }
                                    >
                                        {formatDelta(delta.delta)}
                                    </span>
                                ) : null}
                            </button>
                        )
                    })}
                </div>
            ) : null}
            {stats.dominant ? (
                <div className="podium-stats-extra">
                    Type dominant :{' '}
                    {stats.dominant.src && stats.dominant.src !== 'none' ? (
                        <img
                            className="podium-stats-dominant-icon"
                            src={stats.dominant.src}
                            alt=""
                        />
                    ) : null}
                    <strong>{stats.dominant.count}</strong>
                    {previousLabel ? (
                        <span className="podium-stats-vs">
                            {' '}
                            · deltas vs {previousLabel}
                        </span>
                    ) : null}
                </div>
            ) : previousLabel ? (
                <div className="podium-stats-extra">
                    Deltas vs {previousLabel}
                </div>
            ) : null}
            <div className="podium-stats-extra">
                {stats.zeroNegatives} élève
                {stats.zeroNegatives > 1 ? 's' : ''} sans croix négative
                {stats.studentCount > 0
                    ? ' (' +
                      Math.round(
                          (100 * stats.zeroNegatives) / stats.studentCount
                      ) +
                      ' %)'
                    : ''}
            </div>
        </div>
    )
}

const StudentRankList = ({
    students,
    emptyLabel,
    scorePolarity,
}: {
    students: RankedStudent[]
    emptyLabel: string
    scorePolarity?: CrossPolarity | null
}) => {
    if (students.length === 0) {
        return <div className="podium-empty">{emptyLabel}</div>
    }
    return (
        <React.Fragment>
            {students.map((student, index) => (
                <div key={student.id} className="podium-row">
                    <span className="podium-rank">{index + 1}</span>
                    <span className="podium-name">
                        <span className="podium-firstname">
                            {student.surname}
                        </span>
                        <span className="podium-lastname">{student.name}</span>
                    </span>
                    <span className="podium-scores">
                        {scorePolarity ? (
                            <span
                                className={
                                    scorePolarity === 'positive'
                                        ? 'podium-pos is-solo'
                                        : 'podium-neg'
                                }
                            >
                                {student.slotCount}
                            </span>
                        ) : (
                            <React.Fragment>
                                <span className="podium-neg">
                                    {student.negatives}
                                </span>
                                <span className="podium-pos">
                                    {student.positives}
                                </span>
                            </React.Fragment>
                        )}
                    </span>
                </div>
            ))}
        </React.Fragment>
    )
}

export default () => {
    const { currentUser } = useContext(AuthContext)
    const uid = currentUser ? currentUser.uid : ''
    const { groups, loading: groupsLoading } = useGroups(uid)
    const { students, loading: studentsLoading, allIds } = useStudents(uid)
    const { crosses } = useCrosses(uid, allIds)
    const { periodes, runningPeriode } = usePeriodes(uid)
    const userIcons = useIcons(uid)
    const [maxNegatives, setMaxNegatives] = useState(() =>
        readStoredInt('podiumMaxNegatives', 1)
    )
    const [minPositives, setMinPositives] = useState(() =>
        readStoredInt('podiumMinPositives', 1)
    )
    const [rankSlotType, setRankSlotType] = useState(readStoredSlotType)
    const [periodChoice, setPeriodChoice] = useState<number | null>(null)
    const selectedPeriod =
        periodChoice === null ? runningPeriode : periodChoice
    const previousPeriod = previousPeriodNumber(
        selectedPeriod,
        (periodes || []).length,
        PERIOD_YEAR
    )

    const slots = useMemo(
        () =>
            buildCrossSlots(userIcons.icons, userIcons.positiveIcons).map(
                (slot) => ({
                    ...slot,
                    src: handleIcon(slot.icon),
                })
            ),
        [userIcons.icons, userIcons.positiveIcons]
    )

    const selectedSlot =
        slots.find((slot) => slot.type === rankSlotType) || null

    const chooseSlotType = (type: string) => {
        setRankSlotType(type)
        persistValue('podiumRankSlot', type)
    }

    const classBlocks = useMemo(() => {
        const crossesByStudent: {
            [id: string]: firebase.firestore.DocumentData[]
        } = {}
        ;(crosses || []).forEach((entry) => {
            crossesByStudent[entry.id] = entry.docs || []
        })

        return (groups || []).map((group) => {
            const classStudents = students.filter((student) =>
                studentInClass(student, group)
            )
            const docsInPeriod = classStudents.map((student) => {
                const docs = crossesByStudent[student.id] || []
                return docs.filter((doc) =>
                    crossInSelectedPeriod(doc, periodes, selectedPeriod)
                )
            })
            const docsPrevious =
                previousPeriod === null
                    ? null
                    : classStudents.map((student) => {
                          const docs = crossesByStudent[student.id] || []
                          return docs.filter((doc) =>
                              crossInSelectedPeriod(
                                  doc,
                                  periodes,
                                  previousPeriod
                              )
                          )
                      })
            const stats = computeClassCrossStats(
                docsInPeriod,
                slots,
                userIcons.crossIconMap
            )
            const previousStats =
                docsPrevious === null
                    ? null
                    : computeClassCrossStats(
                          docsPrevious,
                          slots,
                          userIcons.crossIconMap
                      )
            const slotDeltas = previousStats
                ? diffSlotCounts(stats.bySlot, previousStats.bySlot)
                : null

            const scored = classStudents.map((student, index) => {
                const inPeriod = docsInPeriod[index] || []
                let negatives = 0
                let positives = 0
                inPeriod.forEach((doc) => {
                    if (isPositiveCross(doc)) positives += 1
                    else negatives += 1
                })
                return {
                    id: student.id,
                    name: student.name,
                    surname: student.surname,
                    negatives,
                    positives,
                    slotCount: countSlotMatches(
                        inPeriod,
                        selectedSlot,
                        userIcons.crossIconMap
                    ),
                } as RankedStudent
            })

            const rankedNeg = scored
                .filter((student) => student.negatives <= maxNegatives)
                .sort((a, b) => {
                    if (a.negatives !== b.negatives)
                        return a.negatives - b.negatives
                    if (a.positives !== b.positives)
                        return b.positives - a.positives
                    return String(a.name).localeCompare(String(b.name), 'fr', {
                        sensitivity: 'base',
                    })
                })

            const rankedPos = scored
                .filter((student) => student.positives >= minPositives)
                .sort((a, b) => {
                    if (a.positives !== b.positives)
                        return b.positives - a.positives
                    if (a.negatives !== b.negatives)
                        return a.negatives - b.negatives
                    return String(a.name).localeCompare(String(b.name), 'fr', {
                        sensitivity: 'base',
                    })
                })

            const rankedSlot = selectedSlot
                ? scored
                      .slice()
                      .sort((a, b) =>
                          compareBySlotCount(
                              a.slotCount,
                              b.slotCount,
                              selectedSlot.polarity,
                              String(a.name),
                              String(b.name)
                          )
                      )
                : []

            return {
                group,
                rankedNeg,
                rankedPos,
                rankedSlot,
                stats,
                slotDeltas,
            }
        })
    }, [
        groups,
        students,
        crosses,
        periodes,
        selectedPeriod,
        previousPeriod,
        maxNegatives,
        minPositives,
        selectedSlot,
        slots,
        userIcons.crossIconMap,
    ])

    if (currentUser === null) return <div />

    const loading =
        groupsLoading ||
        studentsLoading ||
        userIcons.loading ||
        crosses === undefined ||
        (allIds.length > 0 && crosses.length !== allIds.length)

    const emptyNegLabel =
        maxNegatives === 0
            ? 'Aucun élève sans croix négative'
            : `Aucun élève avec ${maxNegatives} croix négative${
                  maxNegatives > 1 ? 's' : ''
              } ou moins`

    const emptyPosLabel =
        minPositives <= 0
            ? 'Aucun élève'
            : `Aucun élève avec ${minPositives} croix positive${
                  minPositives > 1 ? 's' : ''
              } ou plus`

    const previousLabel =
        previousPeriod === null ? null : 'période ' + previousPeriod

    const slotRankLabel = selectedSlot
        ? selectedSlot.polarity === 'positive'
            ? 'Classement · plus de cette croix'
            : 'Classement · moins de cette croix'
        : ''

    return (
        <SettingsLayout title="Statistiques et podium" backTo="/create">
            {loading ? (
                <p className="settings-panel-note">Chargement…</p>
            ) : groups.length === 0 ? (
                <p className="settings-panel-note">
                    Créez une classe pour afficher les statistiques.
                </p>
            ) : (
                <React.Fragment>
                    <label className="podium-filter">
                        <span className="podium-filter-label">Période</span>
                        <select
                            className="modal-select podium-period-select"
                            value={selectedPeriod}
                            onChange={(event) => {
                                setPeriodChoice(Number(event.target.value))
                            }}
                        >
                            {(periodes || []).map((_, index) => {
                                const n = index + 1
                                return (
                                    <option key={n} value={n}>
                                        {'Période ' +
                                            n +
                                            (n === runningPeriode
                                                ? ' (en cours)'
                                                : '')}
                                    </option>
                                )
                            })}
                            <option value={PERIOD_YEAR}>Année</option>
                        </select>
                    </label>
                    <div className="podium-filter podium-filter-stack">
                        <span className="podium-filter-label">Classer par</span>
                        <div
                            className="podium-slot-picker"
                            role="listbox"
                            aria-label="Croix pour le classement"
                        >
                            <button
                                type="button"
                                className={
                                    'podium-slot-choice' +
                                    (!selectedSlot ? ' is-on' : '')
                                }
                                aria-pressed={!selectedSlot}
                                onClick={() => chooseSlotType('')}
                            >
                                Toutes
                            </button>
                            {slots.map((slot) => {
                                const on = selectedSlot
                                    ? selectedSlot.type === slot.type
                                    : false
                                return (
                                    <button
                                        type="button"
                                        key={slot.type}
                                        className={
                                            'podium-slot-choice' +
                                            (slot.polarity === 'positive'
                                                ? ' is-pos'
                                                : ' is-neg') +
                                            (on ? ' is-on' : '')
                                        }
                                        aria-pressed={on}
                                        onClick={() =>
                                            chooseSlotType(
                                                on ? '' : slot.type
                                            )
                                        }
                                    >
                                        {slot.src && slot.src !== 'none' ? (
                                            <img src={slot.src} alt="" />
                                        ) : (
                                            slot.type
                                        )}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                    {!selectedSlot ? (
                        <React.Fragment>
                            <label className="podium-filter">
                                <span className="podium-filter-label">
                                    Podium · max. croix négatives
                                </span>
                                <select
                                    className="modal-select"
                                    value={maxNegatives}
                                    onChange={(event) => {
                                        const next = Number(event.target.value)
                                        setMaxNegatives(next)
                                        persistValue(
                                            'podiumMaxNegatives',
                                            String(next)
                                        )
                                    }}
                                >
                                    {[0, 1, 2, 3, 4, 5, 6].map((n) => (
                                        <option key={n} value={n}>
                                            {n}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label className="podium-filter">
                                <span className="podium-filter-label">
                                    Top positives · min. croix positives
                                </span>
                                <select
                                    className="modal-select"
                                    value={minPositives}
                                    onChange={(event) => {
                                        const next = Number(event.target.value)
                                        setMinPositives(next)
                                        persistValue(
                                            'podiumMinPositives',
                                            String(next)
                                        )
                                    }}
                                >
                                    {[0, 1, 2, 3, 4, 5, 6].map((n) => (
                                        <option key={n} value={n}>
                                            {n}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </React.Fragment>
                    ) : null}
                    <p className="settings-panel-note">
                        {selectedPeriod === PERIOD_YEAR
                            ? 'Année entière.'
                            : 'Période ' +
                              selectedPeriod +
                              (selectedPeriod === runningPeriode
                                  ? ' en cours.'
                                  : '.')}{' '}
                        {selectedSlot
                            ? selectedSlot.polarity === 'positive'
                                ? 'Classement de la croix positive choisie, du plus au moins.'
                                : 'Classement de la croix négative choisie, du moins au plus.'
                            : 'Rouge = négatives, bleu = positives'}
                        {previousLabel ? ' · deltas vs ' + previousLabel : ''}.
                    </p>
                    {classBlocks.map(
                        ({
                            group,
                            rankedNeg,
                            rankedPos,
                            rankedSlot,
                            stats,
                            slotDeltas,
                        }) => (
                            <div key={group} className="podium-class">
                                <div className="podium-class-title">
                                    {group}
                                </div>
                                <ClassStatsBlock
                                    stats={stats}
                                    slotDeltas={slotDeltas}
                                    previousLabel={previousLabel}
                                    selectedType={
                                        selectedSlot ? selectedSlot.type : ''
                                    }
                                    onSelectType={chooseSlotType}
                                />
                                {selectedSlot ? (
                                    <React.Fragment>
                                        <div className="podium-section-label">
                                            {slotRankLabel}
                                        </div>
                                        <StudentRankList
                                            students={rankedSlot}
                                            emptyLabel="Aucun élève dans cette classe"
                                            scorePolarity={
                                                selectedSlot.polarity
                                            }
                                        />
                                    </React.Fragment>
                                ) : (
                                    <React.Fragment>
                                        <div className="podium-section-label">
                                            Podium
                                        </div>
                                        <StudentRankList
                                            students={rankedNeg}
                                            emptyLabel={emptyNegLabel}
                                        />
                                        <div className="podium-section-label">
                                            Top positives
                                        </div>
                                        <StudentRankList
                                            students={rankedPos}
                                            emptyLabel={emptyPosLabel}
                                        />
                                    </React.Fragment>
                                )}
                            </div>
                        )
                    )}
                </React.Fragment>
            )}
        </SettingsLayout>
    )
}
