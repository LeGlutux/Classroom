import React, { useState, ChangeEvent } from 'react'
import add from '../../images/add.png'
import group from '../../images/group.png'
import solo from '../../images/solo.png'
import NewStudentGroups from '../NewStudentGroups'
import data from '../../data'

export default () => {
    const [groups, setGroups] = useState([{ name: 'Tous' }])
    const [nameInputValue, setNameInputValue] = useState('')
    const [surnameInputValue, setSurnameInputValue] = useState('')
    const [studentGroups, setStudentGroups] = useState([])

    return (
        <div className="w-full flex flex-col items-center">
            <div className="w-8/12 bg-purple-800 h-8 rounded-t-full mt-6 font-studentName text-white text-center pt-1">
                ÉLÈVES
            </div>
            <div className="w-11/12 flex flex-row align-middle justify-between content-center rounded-t-lg h-32 bg-white">
                <img
                    className="w-16 h-16 flex justify-start self-center ml-2"
                    src={solo}
                    alt=""
                />
                <form
                    className="flex flex-row w-3/4"
                    onSubmit={(e) => {
                        if (
                            nameInputValue !== '' &&
                            surnameInputValue !== '' &&
                            studentGroups !== []
                        ) {
                            setNameInputValue('')
                            setSurnameInputValue('')
                        }
                        e.preventDefault()
                        e.stopPropagation()
                    }}
                    action=""
                >
                    <div className="flex flex-col h-full justify-center w-3/4">
                        <input
                            value={nameInputValue}
                            onChange={(e) => setNameInputValue(e.target.value)}
                            className="h-10 my-2 w-full  rounded bg-gray-100 px-3 text-gray-900 border-gray-600 border-2 rounded-full"
                            type="text"
                            placeholder="Nom de l'élève"
                        />
                        <input
                            value={surnameInputValue}
                            onChange={(e) =>
                                setSurnameInputValue(e.target.value)
                            }
                            className="h-10 my-2 w-full  rounded bg-gray-100 px-3 text-gray-900 border-gray-600 border-2 rounded-full"
                            type="text"
                            placeholder="Prénom de l'élève"
                        />
                    </div>
                    <input
                        type="image"
                        className="flex h-16 w-16 self-center"
                        src={add}
                    />
                </form>
            </div>
            <div className="w-11/12 flex flex-row align-middle justify-around content-center border-gray-800 rounded-b-lg pb-2 bg-white">
                <div className="w-full flex flex-wrap flex-row justify-center mr-2">
                    {groups.map(({ name }, index) => {
                        return <NewStudentGroups key={index} name={name} />
                    })}
                </div>
            </div>
        </div>
    )
}
