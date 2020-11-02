import React, { useContext, useState } from 'react'
import { AuthContext } from '../Auth'
import LightStudent from './LightStudent'
import Firebase from '../firebase'
import NavBar from './NavBar'
import list from '../images/list.png'
import add from '../images/add.png'
import NewStudentGroups from './NewStudentGroups'
import { useGroups } from '../hooks'
import ListItem from './ListItem'

export default () => {
    const db = Firebase.firestore()
    const { currentUser } = useContext(AuthContext)
    if (currentUser === null) return <div />
    const { groups } = useGroups(currentUser.uid)
    const [listNameInputValue, setListNameInputValue] = useState('')
    const [defaultList, setDefaultList] = useState<string[]>([])
    const [items, setItems] = useState([0])
    const handleCreateList = () => {
        db.collection('users')
            .doc(currentUser.uid)
            .collection('lists')
            .doc(listNameInputValue)
            .set({})
    }

    return (
        <div className="h-screen w-full flex flex-col">
            <div className="h-24">
                <NavBar />
            </div>

            <form
                className="flex flex-col w-full h-full bg-transparent mt-5"
                onSubmit={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    if (listNameInputValue !== '' && defaultList.length === 1) {
                    } else {
                        throw new Error("le formulaire n'est pas complet")
                    }

                    e.preventDefault()
                    e.stopPropagation()
                }}
                action=""
            >
                <div className="flex flex-col h-full items-center pb-4">
                    <div className="flex flex-row items-center justify-center hover:border-gray-800 xl:w-full">
                        <img className="w-8 h-8 mt-3" src={list} alt="" />
                        <div className="w-9/12 flex flex-col hover:border-gray-800">
                            <input
                                value={listNameInputValue}
                                onChange={(e) =>
                                    setListNameInputValue(e.target.value)
                                }
                                className="h-10 mt-3 placeholder-graborder-gray-800 ml-5 bg-transparent border-b-2 border-gray-800 text-lg xl:text-center"
                                type="text"
                                placeholder="Nom de la liste"
                            />
                        </div>
                    </div>
                    <div className="w-full flex flex-wrap flex-col justify-center mr-2 mt-6 px-2">
                        <div className="text-xl font-studentName text-center font-gray-800">
                            Classes concernées
                        </div>
                        <div className="w-full flex flex-wrap flex-row justify-center">
                            {groups.map((value, index) => {
                                return (
                                    <NewStudentGroups
                                        list={defaultList}
                                        classe={value}
                                        key={index}
                                    />
                                )
                            })}
                        </div>
                        <div className="w-9/12 flex flex-col hover:border-gray-800">
                            {items.map((i, index) => {
                                return <ListItem key={index} n={i} />
                            })}
                        </div>
                        <div className="w-full flex flex-row">
                            <button
                                onClick={(e) => {
                                    e.preventDefault()
                                    setItems(items.concat([items.length]))
                                }}
                            >
                                <img
                                    className="h-6 w-6"
                                    src={add}
                                    alt="ajouter"
                                />
                            </button>
                            <div>Ajouter un item</div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="flex h-8 w-40 self-center mt-6 bg-orange-500 rounded text-white text-lg font-bold justify-center"
                    >
                        Créer la liste
                    </button>
                </div>
            </form>
        </div>
    )
}
