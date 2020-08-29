import React, { useContext } from 'react'
import Student from '../components/Student'
import ClassListFilter from '../components/ClassListFilter'
import NavBar from './NavBar'
import { useGroups, useStudents, useRunningPeriode } from '../hooks'
import { AuthContext } from '../Auth'
import 'firebase/firestore'
export default () => {
    const { currentUser } = useContext(AuthContext)
    if (currentUser === null) return <div />
    const { students, filterStudents } = useStudents(currentUser.uid)
    const { groups } = useGroups(currentUser.uid)
    const { runningPeriode } = useRunningPeriode(currentUser.uid)
    const action = false
    const confirm = false

    return (
        <div className="w-full h-screen flex flex-col">
            <div className="h-24">
                <NavBar />
            </div>

            <div className="flex w-full h-full flex-col bg-white overflow-y-scroll xl:flex-row xl:flex-wrap xl:content-start">
                {students.map(({ name, surname, classes, id }) => {
                    return (
                        <Student
                            key={id}
                            classes={classes}
                            name={name}
                            surname={surname}
                            id={id}
                        />
                    )
                })}
            </div>
            <div className="w-full h-12 bg-gray-300 flex flex-row justify-between table-footer-group">
                <div className="ml-3 pt-2 font-bold text-xl flex justify-between align-top">
                    <div className="overflow-x-scroll">
                        <ClassListFilter
                            onFilter={(group) => {
                                filterStudents(group)
                            }}
                            groups={groups}
                        />
                    </div>

                    <div className="border border-gray-200 mr-6 text-gray-700 rounded">
                        {'P'.concat(runningPeriode.toString())}
                    </div>

                    {/* <form action="" name="form">
                        <select
                            className="block appearance-none bg-gray-200 border border-gray-200 mr-6 text-gray-700 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            onChange={(e) => {
                                db.collection('users')
                                    .doc(currentUser.uid)
                                    .update({
                                        runningPeriode: eval(e.target.value),
                                    })
                                refreshRunningPeriode()
                                refreshPeriodes()
                                // window.location.reload()
                            }}
                        >
                            <option value={periodes.length.toString()}>
                                {'P'.concat(periodes.length.toString())}
                            </option>
                            {pastPeriodes.reverse().map((index, key) => (
                                <option
                                    key={periodes.length - key}
                                    value={periodes.length - key - 1}
                                >
                                    {'P'.concat(
                                        (periodes.indexOf(index) + 1).toString()
                                    )}
                                </option>
                            ))}
                        </select>
                    </form> */}
                </div>
            </div>
        </div>
    )
}
