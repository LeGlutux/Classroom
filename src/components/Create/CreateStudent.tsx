import React, { useState, useContext } from 'react'
import solo from '../../images/solo.png'
import Firebase from '../../firebase'
import NewStudentGroups from '../NewStudentGroups'
import ok from '../../images/ok.png'
import { useLists } from '../../hooks'

interface Props {
    groups: string[]
    currentUserId: string
}

export default (props: Props) => {
    const [sent, setSent] = useState(false)
    const [list, setList] = useState<string[]>([])
    const db = Firebase.firestore()
    const [nameInputValue, setNameInputValue] = useState('')
    const [surnameInputValue, setSurnameInputValue] = useState('')
    const lists = useLists(props.currentUserId)

    return (
        <div
            className={`flex flex-col items-center rounded mt-5 h-auto justify-around mx-6 bg-gray-100 shadow-custom xl:w-5/12 relative`}
        >
            <div
                className={`absolute right-0 top-25 w-10 h-10 ${
                    sent ? 'fade-out' : 'invisible'
                }`}
            >
                <img src={ok} alt="ok" />
            </div>
            <form
                className="flex flex-col w-full h-full bg-transparent mt-5"
                onSubmit={(e) => {
                    if (
                        nameInputValue !== '' &&
                        surnameInputValue !== '' &&
                        list.length === 1
                    ) {
                        const id = Date.now().toString()
                        const nameCased = nameInputValue.replace(/^\w/, (c) =>
                            c.toUpperCase()
                        )
                        const surnameCased = surnameInputValue.replace(
                            /^\w/,
                            (c) => c.toUpperCase()
                        )
                        db.collection('users')
                            .doc(props.currentUserId)
                            .collection('eleves')
                            .doc(id)
                            .set({
                                name: nameCased,
                                surname: surnameCased,
                                classes: list,
                                id,
                                highlight: false,
                            })
                            lists.forEach((l) => {console.log(l.group)
                            console.log(list)
                        console.log(l.group.includes(list[0]))})
                         
                         lists.forEach((l) => {
                             if (l.group.includes(list[0])) {
                             db.collection('users')
                             .doc(props.currentUserId)
                             .collection('eleves')
                             .doc(id)
                             .collection('listes')
                             .doc(l.id.concat('s'))
                             .set({state: 0})}
                         })
                        setNameInputValue('')
                        setSurnameInputValue('')
                        setList(list)
                        setSent(true)
                        setTimeout(() => setSent(false), 1000)
                        clearTimeout()
                    } else {
                        throw new Error("le formulaire n'est pas complet")
                    }

                    e.preventDefault()
                    e.stopPropagation()
                }}
                action=""
            >
                <div className="flex flex-col h-full items-center pb-4">
                    <div className="flex flex-row items-center justify-center hover:border-gray-600 xl:w-full">
                        <img className="w-8 h-8 mt-3" src={solo} alt="" />
                        <div className="w-9/12 flex flex-col hover:border-gray-600">
                            <input
                                value={surnameInputValue}
                                onChange={(e) =>
                                    setSurnameInputValue(e.target.value)
                                }
                                className="h-10 mt-3 placeholder-gray-700 ml-5 bg-transparent border-b-2 border-gray-600 text-lg xl:text-center"
                                type="text"
                                placeholder="Prénom de l'élève"
                            />
                            <input
                                className="h-10 mt-3 placeholder-gray-700 text-lg ml-5 bg-transparent border-b-2 border-gray-600 xl:text-center"
                                value={nameInputValue}
                                onChange={(e) =>
                                    setNameInputValue(e.target.value)
                                }
                                type="text"
                                placeholder="Nom de l'élève"
                            />
                        </div>
                    </div>

                    <div className="w-full flex flex-wrap flex-row justify-center mr-2 mt-6 px-2">
                        {props.groups.map((value, index) => {
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
                        className="flex h-8 w-40 self-center mt-6 bg-orange-500 rounded text-white text-lg font-bold justify-center"
                    >
                        Ajouter l'élève
                    </button>
                </div>
            </form>
        </div>
    )
}
