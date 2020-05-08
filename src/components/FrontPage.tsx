import React, { useContext } from 'react'
import Student from '../components/Student'
import ClassListFilter from '../components/ClassListFilter'
import NavBar from './NavBar'
import eye from '../images/eye.png'
import {
    useGroups,
    useStudents,
    usePeriodes,
    useRunningPeriode,
} from '../hooks'
import { AuthContext } from '../Auth'
import firebase from 'firebase'


export default () => {
    const { currentUser } = useContext(AuthContext)
    if (currentUser === null) return <div />
    const { students, filterStudents, allStudents } = useStudents(
        currentUser.uid
    )
    const db = firebase.firestore()
    const { groups } = useGroups(currentUser.uid)
    const { periodes, refreshPeriodes } = usePeriodes(currentUser.uid)
    const { runningPeriode, refreshRunningPeriode } = useRunningPeriode(
        currentUser.uid
    )

    const pastPeriodes = periodes.filter(
        (i) => periodes.indexOf(i) + 1 !== periodes.length
    )

    return (
        <div className="w-full h-screen flex flex-col">
            <NavBar />

            <div className="flex w-full h-full flex-col bg-white overflow-y-scroll">
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
            <div className="w-full h-12 bg-gray-300 flex flex-row justify-between table-footer-group self-end">
                <div className="ml-3 my-2 font-bold text-xl flex justify-between align-top">
                    <button onClick={() => allStudents()}>Groupes</button>
                    <div className="overflow-x-scroll">
                        <ClassListFilter
                            onFilter={(group) => {
                                filterStudents(group)
                            }}
                            groups={groups}
                        />
                    </div>
                    <div className="mt-2 ml-10 h-4">
                        <button
                            className="flex items-center"
                            onClick={() => {
                                console.log(runningPeriode)
                                console.log(periodes.length)
                            }}
                        >
                            <img className="w-4 h-4" src={eye} alt="" />
                        </button>
                    </div>
                    <form action="" name="form">
                        <select
                            className="block appearance-none bg-gray-200 border border-gray-200 mr-6 text-gray-700 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            onChange={(e) => {
                                db.collection('users')
                                    .doc(currentUser.uid)
                                    .update({
                                        runningPeriode: e.target.value.slice(
                                            -1
                                        ),
                                    })
                                refreshRunningPeriode()
                                refreshPeriodes()
                            }}
                        >
                            <option defaultValue={periodes.length}>
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
                    </form>
                </div>
            </div>
        </div>
    )
}
