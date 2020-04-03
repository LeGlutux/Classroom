import React, { useState, ChangeEvent } from 'react'
import add from '../images/add.png'
import group from '../images/group.png'
import { URL } from 'url'
import solo from '../images/solo.png'
import data from '../data'
import ClassListFilter from '../components/ClassListFilter'

interface SettingsPageProps {
    active: boolean
}

export default () => {
    const [students, setStudents] = useState(data)
    const handleFilter = (group: string) =>
        setStudents(data.filter((student) => student.classe === group))

    return (
        <div className="w-full h-screen flex flex-col flex items-center bg-gray-400">
            <div className="w-8/12 bg-purple-800 h-8 rounded-t-full mt-6 font-studentName text-white text-center pt-1">
                GROUPES
            </div>
            <div className="w-11/12 flex flex-row align-middle justify-around content-center border-gray-800 rounded-lg h-32 bg-white">
                <img
                    className="h-10 flex self-center ml-2"
                    src={group}
                    alt=""
                />
                <div className="w-1/2 ml-4 font-studentName text-sm font-semibold flex items-center mr-2">
                    Ajouter un groupe et valider pour l'ajouter à votre liste de
                    groupe
                </div>
                <input
                    className="w-1/2 h-10 my-10 rounded bg-gray-100 py-2 px-3 text-gray-900 border-gray-600 border-2 rounded-full"
                    type="text"
                    placeholder="Nom du groupe"
                />
                <button className="mx-2">
                    {' '}
                    <img src={add} alt="" />
                </button>
            </div>
            <div className="w-8/12 bg-purple-800 h-8 rounded-t-full mt-6 font-studentName text-white text-center pt-1">
                ÉLÈVES
            </div>
            <div className="w-11/12 flex flex-row align-middle justify-around content-center rounded-t-lg h-32 bg-white">
                <img className="h-10 flex self-center ml-2" src={solo} alt="" />
                <div className="w-1/2 ml-4 font-studentName text-sm font-semibold flex items-center mr-2">
                    Ajouter un élève en sélectionnant le(s) groupe(s)
                </div>
                <div className="flex flex-col h-full justify-center">
                    <input
                        className="h-10 my-2 w-full  rounded bg-gray-100 px-3 text-gray-900 border-gray-600 border-2 rounded-full"
                        type="text"
                        placeholder="Nom de l'élève"
                    />
                    <input
                        className="h-10 my-2 w-full  rounded bg-gray-100 px-3 text-gray-900 border-gray-600 border-2 rounded-full"
                        type="text"
                        placeholder="Prénom de l'élève"
                    />
                </div>
                <button className="mx-2">
                    {' '}
                    <img src={add} alt="" />
                </button>
            </div>
            <div className="w-11/12 flex flex-row align-middle justify-around content-center border-gray-800 rounded-b-lg pb-2 bg-white">
                <div className="w-full h-12 flex flex-row justify-center mr-2">
                    <ClassListFilter
                        onFilter={(group) => handleFilter(group)}
                        groups={Array.from(
                            new Set(data.flatMap((student) => student.classe))
                        )}
                    />
                </div>
            </div>
        </div>
    )
}
