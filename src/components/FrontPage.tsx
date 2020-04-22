import React, { useState, ChangeEvent, useContext } from 'react'
import Student from '../components/Student'
import data from '../data'
import ClassListFilter from '../components/ClassListFilter'
import NavBar from './NavBar'
import { useGroups } from '../hooks'
import { AuthContext } from '../Auth'

export default () => {
    //    const groups = ['5ème3', '5ème5', '3ème3', '3ème5']
    const [students, setStudents] = useState(data)
    const { currentUser } = useContext(AuthContext)
    if (currentUser === null) return <div />
    const { groups } = useGroups(currentUser.uid)
    const handleFilter = (group: string) =>
        setStudents(data.filter((student) => student.classe === group))

    return (
        <div className="flex w-full h-screen flex-col px-2">
            <NavBar />
            <div className="w-full h-12 bg-gray-400 flex flex-row justify-between">
                <div className="ml-3 my-2 font-bold text-xl flex justify-around">
                    Groupes{' '}
                    <div className="mt-2 ml-10 bg-purple-500 md:bg-red-400 lg:bg-purple-800 xl:bg-black h-4 w-4">
                        {' '}
                    </div>
                </div>
                <ClassListFilter
                    onFilter={(group) => handleFilter(group)}
                    groups={groups}
                />
            </div>
            {students.map(({ name, surname, avatar, classe }, index) => {
                return (
                    <Student
                        key={index}
                        classe={classe}
                        name={name}
                        avatar={avatar}
                        surname={surname}
                    />
                )
            })}
        </div>
    )
}
