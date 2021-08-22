import React, { useContext } from 'react'
import NavBar from './NavBar'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../Auth'
import { useLists, useStudents } from '../hooks'
import ListedStudent from './ListedStudent'

export default () => {
    const { id } = useParams<{ id: string }>()
    const { currentUser } = useContext(AuthContext)
    if (currentUser === null) return <div />
    const { students } = useStudents(currentUser.uid)
    const lists = useLists(currentUser.uid)
    if (lists === undefined) return <div />
    const currentList = lists.filter(l => l.id === id)[0]
    if (currentList === undefined) return <div />

    return (
        <div className="w-full h-screen flex flex-col">
            <div className='flex self-center my-4 text-2xl'>{currentList.name}</div>
            <div className='flex flex-row h-auto border-2 border-gray-300'>
                <div className='flex items-center justify-center w-4/12 text-xl border-r-2 border-gray-300'>Nom</div>
                <div className='flex items-center justify-center w-3/12 text-xl border-r-2 border-gray-300'>Classe</div>
                <div className='flex justify-center w-8 text-xl text-vertical-rotated border-l-2 border-gray-300 py-3'>{currentList.items[0]}</div>
                {currentList.itemN > 1 &&
                    <div className='flex justify-center w-8 text-xl text-vertical-rotated border-l-2 border-gray-300 py-3'>{currentList.items[1]}</div>}
                {currentList.itemN > 2 &&
                    <div className='flex justify-center w-8 text-xl text-vertical-rotated border-l-2 border-gray-300 py-3'>{currentList.items[2]}</div>}
                {currentList.itemN > 3 &&
                    <div className='flex justify-center w-8 text-xl text-vertical-rotated border-l-2 border-gray-300 py-3'>{currentList.items[3]}</div>}

            </div>
            <div className="flex w-full flex-col overflow-y-scroll h-full">
                {students.filter((s) => s.classes.includes(currentList.group[0])).map(({ name,
                    surname,
                    classes,
                    id,
                }) => {
                    return (
                        <ListedStudent
                            key={id}
                            name={name}
                            surname={surname}
                            classes={classes}
                            studentId={id}
                            userId={currentUser.uid}
                            currentList={currentList} />
                    )
                })}
            </div>
            <div className={`w-full h-12 bg-gray-300 table-footer-group hello`}>
                <NavBar />
            </div>
        </div>
    )
}


