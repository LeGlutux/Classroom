import React, { useContext, useState } from 'react'
import { AuthContext } from '../Auth'
import Firebase from '../firebase'
import NavBar from './NavBar'
import list from '../images/list.png'
import add from '../images/add.png'
import NewStudentGroups from './NewStudentGroups'
import { useGroups, useLists, useStudents } from '../hooks'
import { useHistory } from 'react-router-dom'

export default () => {
    const db = Firebase.firestore()
    const { currentUser } = useContext(AuthContext)
    if (currentUser === null) return <div />
    const lists = useLists(currentUser.uid)
    const history = useHistory()
    const { groups } = useGroups(currentUser.uid)
    const { students } = useStudents(currentUser.uid)
    const [listNameInputValue, setListNameInputValue] = useState('')
    const [defaultList, setDefaultList] = useState<string[]>([])
    const [itemN, setItemN] = useState(1)
    const [item1, setItem1] = useState('')
    const [item2, setItem2] = useState('')
    const [item3, setItem3] = useState('')
    const [item4, setItem4] = useState('')
    const id = Date.now().toString()
    const handleCreateList = () => {
        db.collection('users')
            .doc(currentUser.uid)
            .collection('lists')
            .doc(id)
            .set({
                name: listNameInputValue,
                id: id,
                date: new Date(),
                group: defaultList,
                itemN,
                item1,
                item2,
                item3,
                item4,
            })
        students.filter((s) => s.classes.includes(defaultList[0])).forEach(s => {
            db.collection('users')
            .doc(currentUser.uid)
            .collection('eleves')
            .doc(s.id)
            .collection('listes')
            .doc(id.concat('s'))
            .set({state: 0})
        })

        console.log(students.filter((s) => s.classes.includes(defaultList[0])))
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
                    setItemN(1)
                    if (
                        lists !== undefined &&
                        listNameInputValue !== '' &&
                        defaultList.length >= 0 &&
                        !(listNameInputValue in lists)
                    ) {
                        handleCreateList()
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
                            <div className="w-9/12 flex flex-col hover:border-gray-800">
                                <input
                                    value={item1}
                                    onChange={(e) => {
                                        setItem1(e.target.value)
                                    }}
                                    className={`h-10 mt-3 placeholder-graborder-gray-800 ml-5 bg-transparent border-b-2 border-gray-800 text-lg xl:text-center ${
                                        itemN >= 1 ? 'visible' : 'invisible'
                                    }`}
                                    type="text"
                                    placeholder={'item 1'}
                                />
                                <input
                                    value={item2}
                                    onChange={(e) => {
                                        setItem2(e.target.value)
                                    }}
                                    className={`h-10 mt-3 placeholder-graborder-gray-800 ml-5 bg-transparent border-b-2 border-gray-800 text-lg xl:text-center ${
                                        itemN >= 2 ? 'visible' : 'invisible'
                                    }`}
                                    type="text"
                                    placeholder={'item 2'}
                                />
                                <input
                                    value={item3}
                                    onChange={(e) => {
                                        setItem3(e.target.value)
                                    }}
                                    className={`h-10 mt-3 placeholder-graborder-gray-800 ml-5 bg-transparent border-b-2 border-gray-800 text-lg xl:text-center ${
                                        itemN >= 3 ? 'visible' : 'invisible'
                                    }`}
                                    type="text"
                                    placeholder={'item 3'}
                                />
                                <input
                                    value={item4}
                                    onChange={(e) => {
                                        setItem4(e.target.value)
                                    }}
                                    className={`h-10 mt-3 placeholder-graborder-gray-800 ml-5 bg-transparent border-b-2 border-gray-800 text-lg xl:text-center ${
                                        itemN >= 4 ? 'visible' : 'invisible'
                                    }`}
                                    type="text"
                                    placeholder={'item 4'}
                                />
                            </div>
                        </div>
                        <div
                            className={`w-full flex flex-row ${
                                itemN >= 4 ? 'invisible' : ''
                            }`}
                        >
                            <button
                                onClick={(e) => {
                                    e.preventDefault()
                                    if (itemN <= 4) setItemN(itemN + 1)
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
                        onClick={() => history.goBack()}
                        className="flex h-8 w-40 self-center mt-6 bg-orange-500 rounded text-white text-lg font-bold justify-center"
                    >
                        Créer la liste
                    </button>
                </div>
            </form>
        </div>
    )
}
