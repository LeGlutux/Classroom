import React, { useContext, useMemo } from 'react'
import firebase from 'firebase/app'
import { useGroups, usePeriodes, useStudents, useCrosses } from '../hooks'
import { AuthContext } from '../Auth'
import SettingsLayout from './SettingsLayout'
import {
    crossInCurrentPeriod,
    isPositiveCross,
    studentInClass,
} from '../functions'

type RankedStudent = {
    id: string
    name: string
    surname: string
    negatives: number
    positives: number
}

export default () => {
    const { currentUser } = useContext(AuthContext)
    const uid = currentUser ? currentUser.uid : ''
    const { groups, loading: groupsLoading } = useGroups(uid)
    const { students, loading: studentsLoading, allIds } = useStudents(uid)
    const { crosses } = useCrosses(uid, allIds)
    const { periodes, runningPeriode } = usePeriodes(uid)

    const rankedByClass = useMemo(() => {
        const crossesByStudent: {
            [id: string]: firebase.firestore.DocumentData[]
        } = {}
        ;(crosses || []).forEach((entry) => {
            crossesByStudent[entry.id] = entry.docs || []
        })

        return (groups || []).map((group) => {
            const ranked = students
                .filter((student) => studentInClass(student, group))
                .map((student) => {
                    const docs = crossesByStudent[student.id] || []
                    const inPeriod = docs.filter((doc) =>
                        crossInCurrentPeriod(doc, periodes, runningPeriode)
                    )
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
                .filter((student) => student.negatives <= 2)
                .sort((a, b) => {
                    if (a.negatives !== b.negatives)
                        return a.negatives - b.negatives
                    if (a.positives !== b.positives)
                        return b.positives - a.positives
                    return String(a.name).localeCompare(String(b.name), 'fr', {
                        sensitivity: 'base',
                    })
                })
            return { group, ranked }
        })
    }, [groups, students, crosses, periodes, runningPeriode])

    if (currentUser === null) return <div />

    const loading =
        groupsLoading ||
        studentsLoading ||
        crosses === undefined ||
        (allIds.length > 0 && crosses.length !== allIds.length)

    return (
        <SettingsLayout title="Podium" backTo="/create">
            {loading ? (
                <p className="settings-panel-note">Chargement du podium…</p>
            ) : groups.length === 0 ? (
                <p className="settings-panel-note">
                    Créez une classe pour afficher un podium.
                </p>
            ) : (
                <React.Fragment>
                    <p className="settings-panel-note">
                        Élèves avec au plus 2 croix négatives sur la période en
                        cours. Le rouge compte les croix négatives, le bleu les
                        positives.
                    </p>
                    {rankedByClass.map(({ group, ranked }) => (
                    <div key={group} className="podium-class">
                        <div className="podium-class-title">{group}</div>
                        {ranked.length === 0 ? (
                            <div className="podium-empty">
                                Aucun élève avec 2 croix négatives ou moins
                            </div>
                        ) : (
                            ranked.map((student, index) => (
                                <div key={student.id} className="podium-row">
                                    <span className="podium-rank">
                                        {index + 1}
                                    </span>
                                    <span className="podium-name">
                                        {student.surname} {student.name}
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
