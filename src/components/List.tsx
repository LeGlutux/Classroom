import React, { useContext, useEffect, useMemo, useState } from 'react'
import NavBar from './NavBar'
import { useParams, useHistory } from 'react-router-dom'
import { AuthContext } from '../Auth'
import { useLists, useStudents } from '../hooks'
import ListedStudent from './ListedStudent'
import { IconChevronLeft } from './Icons'
import { fetchListState } from '../database'
import {
    normalizeListState,
    sortStudentsByListColumn,
} from '../utils/listSort'

const ItemHead = ({
    label,
    index,
    active,
    onToggle,
}: {
    label: string
    index: number
    active: boolean
    onToggle: (index: number) => void
}) => (
    <button
        type="button"
        className={`list-col-head list-col-head-item flex justify-center items-center w-14 flex-shrink-0 text-vertical-rotated border-r py-3 box-border${
            active ? ' is-sorted' : ''
        }`}
        style={{
            minWidth: '54px',
            width: '54px',
            borderColor: 'var(--tn-line)',
        }}
        onClick={() => onToggle(index)}
        aria-pressed={active}
        aria-label={
            active
                ? 'Revenir à l’ordre alphabétique'
                : 'Trier par ' + (label || 'item')
        }
    >
        {label}
    </button>
)

export default () => {
    const onHomeClick = () => {}
    const history = useHistory()
    const { id } = useParams<{ id: string }>()
    const { currentUser } = useContext(AuthContext)
    const uid = currentUser ? currentUser.uid : ''
    const { students } = useStudents(uid)
    const { lists } = useLists(uid)
    const [sortColumn, setSortColumn] = useState<number | null>(null)
    const [frozenOrder, setFrozenOrder] = useState<string[] | null>(null)
    const [statesById, setStatesById] = useState<{
        [studentId: string]: number[]
    }>({})

    const currentList =
        lists && id ? lists.filter((list) => list.id === id)[0] : undefined
    const classStudents = useMemo(() => {
        if (!currentList) return []
        const classe = currentList.group && currentList.group[0]
        return students.filter((student) => {
            const classes = student.classes
            if (Array.isArray(classes)) return classes.indexOf(classe) !== -1
            return classes === classe
        })
    }, [students, currentList])

    const studentIds = classStudents.map((student) => student.id).join('|')
    const listId = currentList ? currentList.id : ''

    useEffect(() => {
        if (!uid || !listId || !studentIds) {
            setStatesById({})
            return
        }
        let cancelled = false
        const ids = studentIds.split('|')
        Promise.all(
            ids.map(async (studentId) => {
                const data = await fetchListState(uid, studentId, listId)
                return [studentId, normalizeListState(data)] as [
                    string,
                    number[]
                ]
            })
        ).then((entries) => {
            if (cancelled) return
            const next: { [studentId: string]: number[] } = {}
            entries.forEach(([studentId, state]) => {
                next[studentId] = state
            })
            setStatesById(next)
        })
        return () => {
            cancelled = true
        }
    }, [uid, listId, studentIds])

    const orderedStudents = useMemo(() => {
        if (sortColumn === null || !frozenOrder) {
            return sortStudentsByListColumn(classStudents, null, {})
        }
        const byId: { [studentId: string]: (typeof classStudents)[0] } = {}
        classStudents.forEach((student) => {
            byId[student.id] = student
        })
        const ordered = frozenOrder
            .map((studentId) => byId[studentId])
            .filter(
                (student): student is (typeof classStudents)[0] => !!student
            )
        classStudents.forEach((student) => {
            if (frozenOrder.indexOf(student.id) === -1) ordered.push(student)
        })
        return ordered
    }, [classStudents, sortColumn, frozenOrder])

    const toggleSort = (index: number) => {
        if (sortColumn === index) {
            setSortColumn(null)
            setFrozenOrder(null)
            return
        }
        setFrozenOrder(
            sortStudentsByListColumn(classStudents, index, statesById).map(
                (student) => student.id
            )
        )
        setSortColumn(index)
    }

    if (currentUser === null) return <div />
    if (lists === undefined || currentList === undefined) return <div />

    const itemN = currentList.itemN || 1

    return (
        <div className="w-full h-screen flex flex-col app-bg overflow-hidden">
            <div className="flex-shrink-0 relative flex flex-row w-full h-12 page-header items-center justify-center">
                <button
                    type="button"
                    className="settings-back"
                    onClick={() => history.goBack()}
                    aria-label="Retour"
                >
                    <IconChevronLeft />
                </button>
                <span className="page-header-title">{currentList.name}</span>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto">
                <div className="px-4 pt-4 pb-16">
                    <div className="list-sheet-head">
                        <div
                            className="flex flex-row h-auto bg-white rounded-lg border overflow-hidden box-border"
                            style={{ borderColor: 'var(--tn-line)' }}
                        >
                            <div
                                className="list-col-head flex items-center justify-center w-5/12 border-r py-4 px-2 box-border"
                                style={{ borderColor: 'var(--tn-line)' }}
                            >
                                Nom
                            </div>
                            <div
                                className="list-col-head flex items-center justify-center w-2/12 border-r py-4 px-2 box-border"
                                style={{ borderColor: 'var(--tn-line)' }}
                            >
                                Classe
                            </div>
                            {Array.from({ length: itemN }).map((_, index) => (
                                <ItemHead
                                    key={index}
                                    index={index}
                                    label={currentList.items[index] || ''}
                                    active={sortColumn === index}
                                    onToggle={toggleSort}
                                />
                            ))}
                        </div>
                    </div>
                    <div>
                        {orderedStudents.map(
                            ({ name, surname, classes, id: studentId }) => {
                                return (
                                    <div
                                        key={studentId}
                                        className="bg-white rounded-lg overflow-hidden mb-1"
                                        style={{
                                            border: '1px solid var(--tn-line)',
                                        }}
                                    >
                                        <ListedStudent
                                            name={name}
                                            surname={surname}
                                            classes={classes[0]}
                                            studentId={studentId}
                                            userId={currentUser.uid}
                                            currentList={currentList}
                                            listState={
                                                statesById[studentId] ||
                                                normalizeListState(undefined)
                                            }
                                            onStateChange={(next) => {
                                                setStatesById((previous) => ({
                                                    ...previous,
                                                    [studentId]: next,
                                                }))
                                            }}
                                        />
                                    </div>
                                )
                            }
                        )}
                    </div>
                </div>
            </div>
            <div className="flex-shrink-0 w-full h-12 nav-wrap">
                <NavBar activeMenu="list" onHomeClick={onHomeClick} />
            </div>
        </div>
    )
}
