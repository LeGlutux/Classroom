import React, { useContext } from 'react'
import NavBar from './NavBar'
import { useParams, useHistory } from 'react-router-dom'
import { AuthContext } from '../Auth'
import { useLists, useStudents } from '../hooks'
import ListedStudent from './ListedStudent'

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
        <div className="w-full h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white overflow-hidden">
            <div className="flex-shrink-0 flex flex-row w-full h-12 page-header items-center justify-between px-3">
                <button
                    className="cursor-pointer flex items-center justify-center w-8 h-8"
                    onClick={() => history.goBack()}
                    aria-label="Retour"
                >
                    <svg
                        className="h-5 w-5 fill-current text-gray-600"
                    >
                        <title>Retour</title>
                        <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                    </svg>
                </button>
                <div className="flex-1 page-header-title px-2">
                    {currentList.name}
                </div>
                <div className="w-8"></div>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto pb-16">
                <div className="px-4 pt-4">
                    <div className="flex flex-row h-auto bg-white rounded-lg shadow-custom border border-gray-200 overflow-hidden mb-2 box-border">
                        <div className="flex items-center justify-center w-5/12 text-lg font-studentName font-semibold text-gray-700 border-r-2 border-gray-200 bg-gray-50 py-4 px-2 box-border">
                            Nom
                        </div>
                        <div className="flex items-center justify-center w-2/12 text-lg font-studentName font-semibold text-gray-700 border-r-2 border-gray-200 bg-gray-50 py-4 px-2 box-border">
                            Classe
                        </div>
                        <div className="flex justify-center items-center w-14 flex-shrink-0 text-xs font-studentName font-semibold text-vertical-rotated border-r-2 border-gray-200 bg-orange-50 text-orange-700 py-3 box-border" style={{ minWidth: '54px', width: '54px' }}>
                            {currentList.items[0]}
                        </div>
                        {currentList.itemN > 1 && (
                            <div className="flex justify-center items-center w-14 flex-shrink-0 text-xs font-studentName font-semibold text-vertical-rotated border-r-2 border-gray-200 bg-orange-50 text-orange-700 py-3 box-border" style={{ minWidth: '54px', width: '54px' }}>
                                {currentList.items[1]}
                            </div>
                        )}
                        {currentList.itemN > 2 && (
                            <div className="flex justify-center items-center w-14 flex-shrink-0 text-xs font-studentName font-semibold text-vertical-rotated border-r-2 border-gray-200 bg-orange-50 text-orange-700 py-3 box-border" style={{ minWidth: '54px', width: '54px' }}>
                                {currentList.items[2]}
                            </div>
                        )}
                        {currentList.itemN > 3 && (
                            <div className="flex justify-center items-center w-14 flex-shrink-0 text-xs font-studentName font-semibold text-vertical-rotated border-r-2 border-gray-200 bg-orange-50 text-orange-700 py-3 box-border" style={{ minWidth: '54px', width: '54px' }}>
                                {currentList.items[3]}
                            </div>
                        )}
                        {currentList.itemN > 4 && (
                            <div className="flex justify-center items-center w-14 flex-shrink-0 text-xs font-studentName font-semibold text-vertical-rotated border-r-2 border-gray-200 bg-orange-50 text-orange-700 py-3 box-border" style={{ minWidth: '54px', width: '54px' }}>
                                {currentList.items[4]}
                            </div>
                        )}
                    </div>
                    <div className="space-y-1">
                        {students
                            .filter((s) => s.classes.includes(currentList.group[0]))
                            .map(({ name, surname, classes, id }) => {
                                return (
                                    <div key={id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
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
