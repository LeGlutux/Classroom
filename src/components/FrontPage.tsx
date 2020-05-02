import React, { useState, ChangeEvent, useContext } from 'react'
import Student from '../components/Student'
import data from '../data'
import ClassListFilter from '../components/ClassListFilter'
import NavBar from './NavBar'
import { useGroups, useStudents, useCross } from '../hooks'
import { AuthContext } from '../Auth'

export default () => {
    const { currentUser } = useContext(AuthContext)
    if (currentUser === null) return <div />
    const { students, filterStudents, allStudents } = useStudents(
        currentUser.uid
    )
    const { groups } = useGroups(currentUser.uid)

    return (
        <div className="w-full h-screen flex flex-col">
            <NavBar />

            <div className="flex w-full h-full flex-col bg-white overflow-y-scroll">
                {students.map(({ name, surname, classes }, index) => {
                    return (
                        <Student
                            key={index}
                            classes={classes}
                            name={name}
                            surname={surname}
                        />
                    )
                })}
            </div>
            <div className="w-full h-12 bg-gray-300 flex flex-row justify-between table-footer-group self-end">
                <div className="ml-3 my-2 font-bold text-xl flex justify-start align-top">
                    <button onClick={() => allStudents()}>Groupes</button>

                    <div className="overflow-x-scroll">
                        <ClassListFilter
                            onFilter={(group) => {
                                filterStudents(group)
                            }}
                            groups={groups}
                        />
                    </div>
                    <div className="mt-2 ml-10 bg-purple-500 md:bg-red-400 lg:bg-purple-800 xl:bg-black h-4 w-4" />
                </div>
            </div>
        </div>
    )
}
