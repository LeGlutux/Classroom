import React, { useContext } from 'react'
import NavBar from './NavBar'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../Auth'
import { useLists, useStudents } from '../hooks'
import ListedStudent from './ListedStudent'

export default () => {
    const { id } = useParams<{id: string}>()
    const { currentUser } = useContext(AuthContext)
    if (currentUser === null) return <div />
    const { students } = useStudents(currentUser.uid)
    const lists = useLists(currentUser.uid)
    if (lists === undefined) return <div />
    const currentList = lists.filter(l => l.id === id)[0]
    if (currentList === undefined) return <div />
    const currentGroups = currentList.group

    return (
        <div className="w-full h-screen flex flex-col">
            <div className="h-24">
                <NavBar />
            </div>
            <div>{currentList.name}</div>
            <div>
               {students.map(({ name,
                            surname,
                            classes,
                            id,
                            selected,
                            highlight,}) => { return (
                                <ListedStudent
                                key={id}
                                name={name}
                                surname={surname}
                                classes={classes}
                                id={id} />
                            )})}
            </div>
        </div>
    )
}
