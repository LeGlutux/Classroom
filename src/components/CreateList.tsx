import React, { useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from '../Auth'
import Firebase from '../firebase'
import NavBar from './NavBar'
import list from '../images/list.png'
import add from '../images/add.png'
import NewStudentGroups from './NewStudentGroups'
import { useGroups, useLists, usePeriodes, useStudents } from '../hooks'
import { useHistory } from 'react-router-dom'

export default () => {
    const db = Firebase.firestore()
    const { currentUser } = useContext(AuthContext)
    if (currentUser === null) return <div />
    const lists = useLists(currentUser.uid)
    const history = useHistory()
    const { groups } = useGroups(currentUser.uid)
    const { students } = useStudents(currentUser.uid)
    const { runningPeriode } = usePeriodes(currentUser.uid)
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
                items: [item1, item2, item3, item4],
            })
        students
            .filter((s) => s.classes.includes(defaultList[0]))
            .forEach((s) => {
                db.collection('users')
                    .doc(currentUser.uid)
                    .collection('eleves')
                    .doc(s.id)
                    .collection('listes')
                    .doc(id.concat('s'))
                    .set({
                        state: defaultValue,
                        id: id.concat('s'),
                    })
            })
    }
    const [refresh, setRefresh] = useState(0)

    const color = (itemN: number) => {
        if (itemN === 0) return 'bg-white'
        if (itemN === 1) return 'bg-green-600'
        if (itemN === 2) return 'bg-red-600'
        if (itemN === 3) return 'bg-white'
        else return ''
    }

    const [defaultValue, setDefaultValue] = useState([0, 0, 0, 0])

    const incrementArray = (itemN: number) => {
        const incrementValue = (previousValue: number) => {
            if (previousValue === 3) return 0
            else return previousValue + 1
        }
        defaultValue.splice(itemN, 1, incrementValue(defaultValue[itemN]))
        setDefaultValue(defaultValue)
    }

    const ref1 = useRef<HTMLInputElement>(null)
    const ref2 = useRef<HTMLInputElement>(null)
    const ref3 = useRef<HTMLInputElement>(null)
    const ref4 = useRef<HTMLInputElement>(null)
    const submitButtonRef = useRef<HTMLButtonElement>(null)

    const nextInputRef =
        itemN === 1
            ? ref2
            : itemN === 2
            ? ref3
            : itemN === 3
            ? ref4
            : submitButtonRef

    const [clickable, setClickable] = useState(false)

    useEffect(() => {
        if (
            lists !== undefined &&
            listNameInputValue !== '' &&
            !(listNameInputValue in lists) &&
            item1 !== '' &&
            !(itemN >= 2 && item2 === '') &&
            !(itemN >= 3 && item3 === '') &&
            !(itemN === 4 && item4 === '')
        ) {
            setClickable(true)
        } else setClickable(false)
    }, [lists, listNameInputValue, item1, itemN, item2, item3, item4])

    return (
        <div className="h-screen w-full flex flex-col">
            <span className="absolute-tr p-4">
                <svg
                    className="h-4 w-4 fill-current text-grey hover:text-grey-darkest"
                    role="button"
                    onClick={() => history.goBack()}
                >
                    <title>Close</title>
                    <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                </svg>
            </span>

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
                        !(listNameInputValue in lists) &&
                        item1 !== '' &&
                        !(itemN >= 2 && item2 === '') &&
                        !(itemN >= 3 && item3 === '') &&
                        !(itemN === 4 && item4 === '')
                    ) {
                        handleCreateList()
                    } else {
                        alert("le formulaire n'est pas complet")
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
                                className="h-10 mt-3 ml-5 bg-transparent border-b-2 border-gray-800 text-lg xl:text-center"
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
                        <div className="flex flex-row w-full pl-10 mt-5">
                            <div className="ml-5 w-40" />
                            <div className="font-student ml-3">Par défaut</div>
                        </div>
                        <div className="w-9/12 flex flex-col hover:border-gray-800">
                            <div className="w-9/12 flex flex-col hover:border-gray-800">
                                <div
                                    className={`flex flex-row items-end ml-10 ${
                                        itemN >= 1 ? 'visible' : 'invisible'
                                    }`}
                                >
                                    <input
                                        value={item1}
                                        ref={ref1}
                                        onChange={(e) => {
                                            setItem1(e.target.value)
                                        }}
                                        className={`h-10 mt-3 ml-5 bg-transparent w-40 border-b-2 border-gray-800 text-lg xl:text-center`}
                                        type="text"
                                        placeholder={'item 1'}
                                    />
                                    <div
                                        className={`flex justify-center items-center w-6 h-6 ml-10 border-black border-2 mb-1 ${color(
                                            defaultValue[0]
                                        )}`}
                                    >
                                        <button
                                            className={`w-6 h-6 text-bold ${
                                                defaultValue[0] !== 3
                                                    ? 'text-invisible'
                                                    : 'text-base'
                                            }`}
                                            onClick={(e) => {
                                                incrementArray(0)
                                                setRefresh(refresh + 1)
                                                e.preventDefault()
                                                e.stopPropagation()
                                            }}
                                        >
                                            ?
                                        </button>
                                    </div>
                                </div>
                                <div
                                    className={`flex flex-row items-end ${
                                        itemN >= 2 ? 'visible' : 'invisible'
                                    }`}
                                >
                                    <span
                                        className={`flex mx-3 h-4 w-4 mb-3 ${
                                            itemN === 2
                                                ? 'visible'
                                                : 'invisible'
                                        }`}
                                    >
                                        <svg
                                            className="h-4 w-4 fill-current text-grey hover:text-grey-darkest"
                                            role="button"
                                            onClick={() => {
                                                setItemN(itemN - 1)
                                                setItem2('')
                                            }}
                                        >
                                            <title>Close</title>
                                            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                                        </svg>
                                    </span>
                                    <input
                                        value={item2}
                                        ref={ref2}
                                        onChange={(e) => {
                                            setItem2(e.target.value)
                                        }}
                                        className={`h-10 mt-3 ml-5 bg-transparent w-40 border-b-2 border-gray-800 text-lg xl:text-center`}
                                        type="text"
                                        placeholder={'item 2'}
                                    />
                                    <div
                                        className={`flex justify-center items-center w-6 h-6 ml-10 border-black border-2 mb-1 ${color(
                                            defaultValue[1]
                                        )}`}
                                    >
                                        <button
                                            className={`w-6 h-6 text-bold ${
                                                defaultValue[1] !== 3
                                                    ? 'text-invisible'
                                                    : 'text-base'
                                            }`}
                                            onClick={(e) => {
                                                incrementArray(1)
                                                setRefresh(refresh + 1)
                                                e.preventDefault()
                                                e.stopPropagation()
                                            }}
                                        >
                                            ?
                                        </button>
                                    </div>
                                </div>
                                <div
                                    className={`flex flex-row items-end ${
                                        itemN >= 3 ? 'visible' : 'invisible'
                                    }`}
                                >
                                    <span
                                        className={`flex mx-3 h-4 w-4 mb-3 ${
                                            itemN === 3
                                                ? 'visible'
                                                : 'invisible'
                                        }`}
                                    >
                                        <svg
                                            className="h-4 w-4 fill-current text-grey hover:text-grey-darkest"
                                            role="button"
                                            onClick={() => {
                                                setItemN(itemN - 1)
                                                setItem3('')
                                            }}
                                        >
                                            <title>Close</title>
                                            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                                        </svg>
                                    </span>
                                    <input
                                        value={item3}
                                        ref={ref3}
                                        onChange={(e) => {
                                            setItem3(e.target.value)
                                        }}
                                        className={`h-10 mt-3 ml-5 bg-transparent w-40 border-b-2 border-gray-800 text-lg xl:text-center`}
                                        type="text"
                                        placeholder={'item 3'}
                                    />
                                    <div
                                        className={`flex justify-center items-center w-6 h-6 ml-10 border-black border-2 mb-1 ${color(
                                            defaultValue[2]
                                        )}`}
                                    >
                                        <button
                                            className={`w-6 h-6 text-bold ${
                                                defaultValue[2] !== 3
                                                    ? 'text-invisible'
                                                    : 'text-base'
                                            }`}
                                            onClick={(e) => {
                                                incrementArray(2)
                                                setRefresh(refresh + 1)
                                                e.preventDefault()
                                                e.stopPropagation()
                                            }}
                                        >
                                            ?
                                        </button>
                                    </div>
                                </div>
                                <div
                                    className={`flex flex-row items-end ${
                                        itemN === 4 ? 'visible' : 'invisible'
                                    }`}
                                >
                                    <span
                                        className={`flex mx-3 h-4 w-4 mb-3 ${
                                            itemN === 4
                                                ? 'visible'
                                                : 'invisible'
                                        }`}
                                    >
                                        <svg
                                            className="h-4 w-4 fill-current text-grey hover:text-grey-darkest"
                                            role="button"
                                            onClick={() => {
                                                setItemN(itemN - 1)
                                                setItem4('')
                                            }}
                                        >
                                            <title>Close</title>
                                            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                                        </svg>
                                    </span>
                                    <input
                                        value={item4}
                                        ref={ref4}
                                        onChange={(e) => {
                                            setItem4(e.target.value)
                                        }}
                                        className={`h-10 mt-3 ml-5 bg-transparent w-40 border-b-2 border-gray-800 text-lg xl:text-center`}
                                        type="text"
                                        placeholder={'item 4'}
                                    />
                                    <div
                                        className={`flex justify-center items-center w-6 h-6 ml-10 border-black border-2 mb-1 ${color(
                                            defaultValue[3]
                                        )}`}
                                    >
                                        <button
                                            className={`w-6 h-6 text-bold ${
                                                defaultValue[3] !== 3
                                                    ? 'text-invisible'
                                                    : 'text-base'
                                            }`}
                                            onClick={(e) => {
                                                incrementArray(3)
                                                setRefresh(refresh + 1)
                                                e.preventDefault()
                                                e.stopPropagation()
                                            }}
                                        >
                                            ?
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            className={`w-full flex flex-row ${
                                itemN >= 4 ? 'invisible' : ''
                            }`}
                        >
                            <button
                                type="submit"
                                className="flex flex-row"
                                onClick={(e) => {
                                    e.preventDefault()
                                    if (itemN <= 4) setItemN(itemN + 1)
                                    setTimeout(
                                        () => nextInputRef.current!.focus(),
                                        10
                                    )
                                }}
                            >
                                <img
                                    className="h-6 w-6 mx-4"
                                    src={add}
                                    alt="ajouter"
                                />
                                Ajouter un item
                            </button>
                        </div>
                    </div>

                    <div
                        className={`flex h-8 w-40 self-center mt-6 bg-gray-300 rounded text-gray-100 text-lg font-bold justify-center ${
                            clickable ? 'hidden' : 'visible'
                        }`}
                    >
                        Créer la liste
                    </div>
                    <button
                        type="submit"
                        ref={submitButtonRef}
                        onClick={() => history.goBack()}
                        className={`flex h-8 w-40 self-center mt-6 bg-orange-500 rounded text-white text-lg font-bold justify-center ${
                            clickable ? 'visible' : 'hidden'
                        }`}
                    >
                        Créer la liste
                    </button>
                </div>
            </form>
            <div className={`w-full h-12 bg-gray-300 sticky bottom-0`}>
                <NavBar activeMenu="list" />
            </div>
        </div>
    )
}
