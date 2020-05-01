import React, { useState, ChangeEvent, useContext, useEffect } from 'react'
import add from '../../images/add.png'
import solo from '../../images/solo.png'
import { AuthContext } from '../../Auth'
import Firebase from '../../firebase'
import NewStudentGroups from '../NewStudentGroups'
import { NONAME } from 'dns'
import { Server } from 'tls'

interface Props {
    groups: string[]
}

export default ({ groups }: Props) => {
    const firestore = Firebase.firestore()
    const list = [] as string[]
    const db = Firebase.firestore()
    const { currentUser } = useContext(AuthContext)
    if (currentUser === null) return <div />
    const [nameInputValue, setNameInputValue] = useState('')
    const [surnameInputValue, setSurnameInputValue] = useState('')
    const padre = 'list'

    return (
        <div className="flex flex-col items-center rounded mt-5 h-auto justify-around mx-6 bg-gray-100 shadow-custom">
            <form
                className="flex flex-col w-full h-full bg-transparent mt-5"
                onSubmit={(e) => {
                    if (
                        nameInputValue !== '' &&
                        surnameInputValue !== '' &&
                        list.length !== 0
                    ) {
                        setNameInputValue('')
                        setSurnameInputValue('')
                        firestore
                            .collection('users')
                            .doc(currentUser.uid)
                            .collection('eleves')
                            .doc(
                                surnameInputValue
                                    .concat(' ')
                                    .concat(nameInputValue)
                            )
                            .collection('crosses')
                    } else {
                        console.log("le formulaire n'est pas complet")
                    }

                    e.preventDefault()
                    e.stopPropagation()
                }}
                action=""
            >
                <div className="flex flex-col h-full items-center pb-4">
                    <div className="flex flex-row items-center justify-center hover:border-gray-600">
                        <img className="w-8 h-8 mt-3" src={solo} alt="" />
                        <div className="w-9/12 flex flex-col hover:border-gray-600">
                            <input
                                className="h-10 mt-3 placeholder-gray-700 text-xl ml-5 bg-transparent border-b-2 border-gray-600"
                                value={nameInputValue}
                                onChange={(e) =>
                                    setNameInputValue(e.target.value)
                                }
                                type="text"
                                placeholder="Nom de l'élève"
                            />
                            <input
                                value={surnameInputValue}
                                onChange={(e) =>
                                    setSurnameInputValue(e.target.value)
                                }
                                className="h-10 mt-3 placeholder-gray-700 ml-5 bg-transparent border-b-2 border-gray-600 text-xl"
                                type="text"
                                placeholder="Prénom de l'élève"
                            />
                        </div>
                    </div>

                    <div className="w-full flex flex-wrap flex-row justify-center mr-2 mt-6 px-2">
                        {groups.map((value, index) => {
                            return (
                                <NewStudentGroups
                                    list={list}
                                    classe={value}
                                    key={index}
                                />
                            )
                        })}
                    </div>
                    <button
                        type="submit"
                        className="flex h-10 w-48 self-center mt-6 bg-orange-500 rounded text-white flex text-xl font-bold justify-center"
                    >
                        Ajouter l'élève
                    </button>
                </div>
            </form>
        </div>
    )
}
