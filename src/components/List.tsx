import React, { useContext } from 'react'
import NavBar from './NavBar'
import { useParams, useHistory } from 'react-router-dom'
import { AuthContext } from '../Auth'
import { useLists, useStudents } from '../hooks'
import ListedStudent from './ListedStudent'
import { IconChevronLeft } from './Icons'

export default () => {
    const onHomeClick = () => {}
    const history = useHistory()
    const { id } = useParams<{ id: string }>()
    const { currentUser } = useContext(AuthContext)
    if (currentUser === null) return <div />
    const { students } = useStudents(currentUser.uid)
    const { lists } = useLists(currentUser.uid)
    if (lists === undefined) return <div />
    const currentList = lists.filter((l) => l.id === id)[0]
    if (currentList === undefined) return <div />

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
            <div className="flex-1 min-h-0 overflow-y-auto pb-16">
                <div className="px-4 pt-4">
                    <div className="flex flex-row h-auto bg-white rounded-lg border overflow-hidden mb-2 box-border" style={{ borderColor: 'var(--tn-line)' }}>
                        <div className="list-col-head flex items-center justify-center w-5/12 border-r py-4 px-2 box-border" style={{ borderColor: 'var(--tn-line)' }}>
                            Nom
                        </div>
                        <div className="list-col-head flex items-center justify-center w-2/12 border-r py-4 px-2 box-border" style={{ borderColor: 'var(--tn-line)' }}>
                            Classe
                        </div>
                        <div className="list-col-head flex justify-center items-center w-14 flex-shrink-0 text-vertical-rotated border-r py-3 box-border" style={{ minWidth: '54px', width: '54px', borderColor: 'var(--tn-line)' }}>
                            {currentList.items[0]}
                        </div>
                        {currentList.itemN > 1 && (
                            <div className="list-col-head flex justify-center items-center w-14 flex-shrink-0 text-vertical-rotated border-r py-3 box-border" style={{ minWidth: '54px', width: '54px', borderColor: 'var(--tn-line)' }}>
                                {currentList.items[1]}
                            </div>
                        )}
                        {currentList.itemN > 2 && (
                            <div className="list-col-head flex justify-center items-center w-14 flex-shrink-0 text-vertical-rotated border-r py-3 box-border" style={{ minWidth: '54px', width: '54px', borderColor: 'var(--tn-line)' }}>
                                {currentList.items[2]}
                            </div>
                        )}
                        {currentList.itemN > 3 && (
                            <div className="list-col-head flex justify-center items-center w-14 flex-shrink-0 text-vertical-rotated border-r py-3 box-border" style={{ minWidth: '54px', width: '54px', borderColor: 'var(--tn-line)' }}>
                                {currentList.items[3]}
                            </div>
                        )}
                        {currentList.itemN > 4 && (
                            <div className="list-col-head flex justify-center items-center w-14 flex-shrink-0 text-vertical-rotated border-r py-3 box-border" style={{ minWidth: '54px', width: '54px', borderColor: 'var(--tn-line)' }}>
                                {currentList.items[4]}
                            </div>
                        )}
                    </div>
                    <div>
                        {students
                            .filter((s) => s.classes.includes(currentList.group[0]))
                            .map(({ name, surname, classes, id }) => {
                                return (
                                    <div
                                        key={id}
                                        className="bg-white rounded-lg overflow-hidden mb-1"
                                        style={{ border: '1px solid var(--tn-line)' }}
                                    >
                                        <ListedStudent
                                            name={name}
                                            surname={surname}
                                            classes={classes[0]}
                                            studentId={id}
                                            userId={currentUser.uid}
                                            currentList={currentList}
                                        />
                                    </div>
                                )
                            })}
                    </div>
                </div>
            </div>
            <div className="flex-shrink-0 w-full h-12 nav-wrap">
                <NavBar activeMenu="list" onHomeClick={onHomeClick} />
            </div>
        </div>
    )
}
