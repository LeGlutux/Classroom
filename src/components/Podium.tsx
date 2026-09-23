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
    PERIOD_YEAR,
    buildCrossSlots,
    crossInSelectedPeriod,
    handleIcon,
    isPositiveCross,
    studentInClass,
} from '../functions'
import {
    ClassCrossStats,
    computeClassCrossStats,
} from '../utils/classCrossStats'

type RankedStudent = {
    id: string
    name: string
    surname: string
    negatives: number
    positives: number
}

const readMaxNegatives = () => {
    try {
        const n = Number(window.localStorage.getItem('podiumMaxNegatives'))
        if (Number.isFinite(n) && n >= 0 && n <= 6) return n
    } catch (e) {
        // ignore
    }
    return 1
}

const ClassStatsBlock = ({ stats }: { stats: ClassCrossStats }) => {
    const avg =
        stats.studentCount > 0
            ? (stats.total / stats.studentCount).toFixed(1).replace('.', ',')
            : '0'
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
                    {stats.bySlot.map((slot) => (
                        <span
                            key={slot.type}
                            className={
                                'podium-stats-type' +
                                (slot.polarity === 'positive'
                                    ? ' is-pos'
                                    : ' is-neg')
                            }
                        >
                            {slot.src && slot.src !== 'none' ? (
                                <img src={slot.src} alt="" />
                            ) : null}
                            <span>{slot.count}</span>
                        </span>
                    ))}
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

export default () => {
    const { currentUser } = useContext(AuthContext)
    const uid = currentUser ? currentUser.uid : ''
    const { groups, loading: groupsLoading } = useGroups(uid)
    const { students, loading: studentsLoading, allIds } = useStudents(uid)
    const { crosses } = useCrosses(uid, allIds)
    const { periodes, runningPeriode } = usePeriodes(uid)
    const userIcons = useIcons(uid)
    const [maxNegatives, setMaxNegatives] = useState(readMaxNegatives)
    const [periodChoice, setPeriodChoice] = useState<number | null>(null)
    const selectedPeriod =
        periodChoice === null ? runningPeriode : periodChoice

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
            const stats = computeClassCrossStats(
                docsInPeriod,
                slots,
                userIcons.crossIconMap
            )
            const ranked = classStudents
                .map((student, index) => {
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
                    } as RankedStudent
                })
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
            return { group, ranked, stats }
        })
    }, [
        groups,
        students,
        crosses,
        periodes,
        selectedPeriod,
        maxNegatives,
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

    const emptyLabel =
        maxNegatives === 0
            ? 'Aucun élève sans croix négative'
            : `Aucun élève avec ${maxNegatives} croix négative${
                  maxNegatives > 1 ? 's' : ''
              } ou moins`

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
                                try {
                                    window.localStorage.setItem(
                                        'podiumMaxNegatives',
                                        String(next)
                                    )
                                } catch (e) {
                                    // ignore
                                }
                            }}
                        >
                            {[0, 1, 2, 3, 4, 5, 6].map((n) => (
                                <option key={n} value={n}>
                                    {n}
                                </option>
                            ))}
                        </select>
                    </label>
                    <p className="settings-panel-note">
                        {selectedPeriod === PERIOD_YEAR
                            ? 'Année entière.'
                            : 'Période ' +
                              selectedPeriod +
                              (selectedPeriod === runningPeriode
                                  ? ' en cours.'
                                  : '.')}{' '}
                        Rouge = négatives, bleu = positives.
                    </p>
                    {classBlocks.map(({ group, ranked, stats }) => (
                        <div key={group} className="podium-class">
                            <div className="podium-class-title">{group}</div>
                            <ClassStatsBlock stats={stats} />
                            <div className="podium-section-label">Podium</div>
                            {ranked.length === 0 ? (
                                <div className="podium-empty">{emptyLabel}</div>
                            ) : (
                                ranked.map((student, index) => (
                                    <div key={student.id} className="podium-row">
                                        <span className="podium-rank">
                                            {index + 1}
                                        </span>
                                        <span className="podium-name">
                                            <span className="podium-firstname">
                                                {student.surname}
                                            </span>
                                            <span className="podium-lastname">
                                                {student.name}
                                            </span>
                                        </span>
                                        <span className="podium-scores">
                                            <span className="podium-neg">
                                                {student.negatives}
                                            </span>
                                            <span className="podium-pos">
                                                {student.positives}
                                            </span>
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    ))}
                </React.Fragment>
            )}
        </SettingsLayout>
    )
}
