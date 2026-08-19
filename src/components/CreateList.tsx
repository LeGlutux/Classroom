import React, { useContext, useEffect, useRef, useState } from 'react'
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
    const [defaultList] = useState<string[]>([])
    const [itemN, setItemN] = useState(1)
    const [item1, setItem1] = useState('')
    const [item2, setItem2] = useState('')
    const [item3, setItem3] = useState('')
    const [item4, setItem4] = useState('')
    const [item5, setItem5] = useState('')

    const handleCreateList = (empty: boolean) => {
        const item1IfEmpty = empty ? listNameInputValue : item1 // Mettre l'item1 au nom de la liste s'il est seul
        defaultList.forEach((elem) => {
            const id = Date.now().toString() + (Math.random() * 1000).toString()
            db.collection('users')
                .doc(currentUser.uid)
                .collection('lists')
                .doc(id)
                .set({
                    name: listNameInputValue,
                    id: id,
                    date: new Date(),
                    group: [elem],
                    itemN,
                    items: [item1IfEmpty, item2, item3, item4, item5],
                })
            students
                .filter((s) => s.classes.includes(elem))
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
        })
    }
    const [refresh, setRefresh] = useState(0)

    const handleHomeClick = () => {
        localStorage.removeItem('displayedGroup')
    }

    const color = (itemN: number) => {
        if (itemN === 0) return 'bg-white'
        if (itemN === 1) return 'bg-green-600'
        if (itemN === 2) return 'bg-red-600'
        if (itemN === 3) return 'bg-yellow-500'
        if (itemN === 4) return 'bg-yellow-400' // Question mark
        else return 'bg-white'
    }

    const [defaultValue, setDefaultValue] = useState([0, 0, 0, 0, 0])

    const incrementArray = (itemN: number) => {
        const incrementValue = (previousValue: number) => {
            if (previousValue === 4) return 0
            else return previousValue + 1
        }
        defaultValue.splice(itemN, 1, incrementValue(defaultValue[itemN]))
        setDefaultValue(defaultValue)
    }

    const ref1 = useRef<HTMLInputElement>(null)
    const ref2 = useRef<HTMLInputElement>(null)
    const ref3 = useRef<HTMLInputElement>(null)
    const ref4 = useRef<HTMLInputElement>(null)
    const ref5 = useRef<HTMLInputElement>(null)
    const submitButtonRef = useRef<HTMLButtonElement>(null)

    const nextInputRef =
        itemN === 1
            ? ref2
            : itemN === 2
            ? ref3
            : itemN === 3
            ? ref4
            : itemN === 4
            ? ref5
            : submitButtonRef

    const [clickable, setClickable] = useState(false)

    useEffect(() => {
        if (
            lists !== undefined &&
            listNameInputValue !== '' &&
            !(listNameInputValue in lists) &&
            (item1 !== '' || (item1 === '' && itemN === 1)) &&
            !(itemN >= 2 && item2 === '') &&
            !(itemN >= 3 && item3 === '') &&
            !(itemN === 4 && item4 === '')
        ) {
            setClickable(true)
        } else setClickable(false)
    }, [lists, listNameInputValue, item1, itemN, item2, item3, item4])

    return (
        <div className="h-screen w-full flex flex-col bg-gradient-to-b from-gray-50 to-white overflow-hidden">
            <div className="flex-shrink-0 flex flex-row w-full h-14 page-header items-center font-title font-bold justify-between text-3xl xl:text-4xl xl:h-16 px-4">
                <button
                    className="cursor-pointer hover:opacity-70 transition-opacity flex items-center justify-center"
                    onClick={() => history.goBack()}
                    aria-label="Retour"
                >
                    <svg
                        className="h-6 w-6 fill-current text-gray-600 hover:text-gray-800"
                    >
                        <title>Retour</title>
                        <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                    </svg>
                </button>
                <div className="flex-1 text-center">
                    Créer une liste
                </div>
                <div className="w-10"></div>
            </div>

            <form
                className="flex flex-col flex-1 min-h-0 w-full bg-transparent overflow-y-auto"
                onSubmit={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setItemN(1)
                    if (
                        lists !== undefined &&
                        listNameInputValue !== '' &&
                        defaultList.length >= 0 &&
                        !(listNameInputValue in lists) &&
                        (item1 !== '' || (item1 === '' && itemN === 1)) &&
                        !(itemN >= 2 && item2 === '') &&
                        !(itemN >= 3 && item3 === '') &&
                        !(itemN === 4 && item4 === '')
                    ) {
                        handleCreateList(item1 === '' && itemN === 1)
                    } else {
                        alert("le formulaire n'est pas complet")
                    }

                    e.preventDefault()
                    e.stopPropagation()
                }}
                action=""
            >
                <div className="flex flex-col items-center px-4 pt-4 pb-20">
                    <div className="w-full max-w-2xl mb-4">
                        <div className="flex flex-row items-center justify-center bg-white rounded-lg shadow-custom p-4 border border-gray-200">
                            <img className="w-8 h-8 mr-3" src={list} alt="Liste" />
                            <div className="w-full flex flex-col">
                                <label className="text-sm font-studentName text-gray-600 mb-1">
                                    Nom de la liste
                                </label>
                                <input
                                    value={listNameInputValue}
                                    onChange={(e) =>
                                        setListNameInputValue(e.target.value)
                                    }
                                    className="h-12 bg-transparent border-b-2 border-gray-300 focus:border-orange-500 focus:outline-none text-lg font-studentName transition-colors"
                                    type="text"
                                    placeholder="Ex: Devoirs maison, Participation..."
                                />
                            </div>
                        </div>
                    </div>
                    <div className="w-full max-w-2xl flex flex-wrap flex-col justify-center mb-4">
                        <div className="bg-white rounded-lg shadow-custom p-4 border border-gray-200">
                            <div className="text-lg font-studentName text-gray-800 mb-3 font-semibold">
                                Classes concernées
                            </div>
                            <div className="w-full flex flex-wrap flex-row gap-2 justify-start">
                                {groups.map((value, index) => {
                                    return (
                                        <div key={index} className="bg-gray-50 rounded-lg px-2 py-1.5 border border-gray-200 hover:border-orange-300 transition-colors">
                                            <NewStudentGroups
                                                list={defaultList}
                                                classe={value}
                                                key={index}
                                            />
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="flex flex-row w-full mt-3 pt-3 border-t border-gray-200">
                                <div className="font-student text-xs text-gray-600 italic">
                                    <span role="img" aria-label="ampoule">💡</span> Sélectionnez les classes pour lesquelles cette liste sera utilisée
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full max-w-2xl">
                        <div className="bg-white rounded-lg shadow-custom p-4 border border-gray-200 mb-3">
                            <div className="text-lg font-studentName text-gray-800 mb-3 font-semibold">
                                Items de la liste
                            </div>
                            <div className="flex flex-col gap-3">
                                {itemN >= 1 && (
                                <div className="flex flex-row items-center gap-4">
                                    <div className="flex-1">
                                        <input
                                            value={item1}
                                            ref={ref1}
                                            onChange={(e) => {
                                                setItem1(e.target.value)
                                            }}
                                            className="h-10 w-full bg-gray-50 border-2 border-gray-200 rounded-lg px-3 text-base font-studentName focus:border-orange-500 focus:outline-none transition-colors"
                                            type="text"
                                            placeholder="Item 1 (ex: Fait, À faire...)"
                                        />
                                    </div>
                                    <button
                                        className={`flex justify-center items-center w-9 h-9 rounded-lg border-2 transition-all hover:scale-110 ${color(
                                            defaultValue[0]
                                        )} ${defaultValue[0] === 0 ? 'border-gray-300 bg-white' : defaultValue[0] === 1 ? 'border-green-600' : defaultValue[0] === 2 ? 'border-red-600' : 'border-yellow-500'}`}
                                        onClick={(e) => {
                                            incrementArray(0)
                                            setRefresh(refresh + 1)
                                            e.preventDefault()
                                            e.stopPropagation()
                                        }}
                                    >
                                        <span className={`text-base font-bold ${
                                            defaultValue[0] !== 4
                                                ? 'text-gray-600'
                                                : 'text-yellow-700'
                                        }`}>
                                            {defaultValue[0] === 4 ? '?' : defaultValue[0] === 1 ? '✓' : defaultValue[0] === 2 ? '✗' : ''}
                                        </span>
                                    </button>
                                </div>
                                )}
                                {itemN >= 2 && (
                                <div className="flex flex-row items-center gap-4">
                                    <button
                                        type="button"
                                        className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors flex-shrink-0 overflow-hidden p-0 min-w-[28px]"
                                        onClick={() => {
                                            setItemN(itemN - 1)
                                            setItem2('')
                                        }}
                                    >
                                        <svg
                                            className="h-4 w-4 fill-current text-gray-600"
                                            viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <title>Supprimer</title>
                                            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                                        </svg>
                                    </button>
                                    <div className="flex-1">
                                        <input
                                            value={item2}
                                            ref={ref2}
                                            onChange={(e) => {
                                                setItem2(e.target.value)
                                            }}
                                            className="h-10 w-full bg-gray-50 border-2 border-gray-200 rounded-lg px-3 text-base font-studentName focus:border-orange-500 focus:outline-none transition-colors"
                                            type="text"
                                            placeholder="Item 2"
                                        />
                                    </div>
                                    <button
                                        className={`flex justify-center items-center w-9 h-9 rounded-lg border-2 transition-all hover:scale-110 ${color(
                                            defaultValue[1]
                                        )} ${defaultValue[1] === 0 ? 'border-gray-300 bg-white' : defaultValue[1] === 1 ? 'border-green-600' : defaultValue[1] === 2 ? 'border-red-600' : 'border-yellow-500'}`}
                                        onClick={(e) => {
                                            incrementArray(1)
                                            setRefresh(refresh + 1)
                                            e.preventDefault()
                                            e.stopPropagation()
                                        }}
                                    >
                                        <span className={`text-base font-bold ${
                                            defaultValue[1] !== 4
                                                ? 'text-gray-600'
                                                : 'text-yellow-700'
                                        }`}>
                                            {defaultValue[1] === 4 ? '?' : defaultValue[1] === 1 ? '✓' : defaultValue[1] === 2 ? '✗' : ''}
                                        </span>
                                    </button>
                                </div>
                                )}
                                {itemN >= 3 && (
                                <div className="flex flex-row items-center gap-4">
                                    <button
                                        type="button"
                                        className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors flex-shrink-0 overflow-hidden p-0 min-w-[28px]"
                                        onClick={() => {
                                            setItemN(itemN - 1)
                                            setItem3('')
                                        }}
                                    >
                                        <svg
                                            className="h-4 w-4 fill-current text-gray-600"
                                            viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <title>Supprimer</title>
                                            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                                        </svg>
                                    </button>
                                    <div className="flex-1">
                                        <input
                                            value={item3}
                                            ref={ref3}
                                            onChange={(e) => {
                                                setItem3(e.target.value)
                                            }}
                                            className="h-10 w-full bg-gray-50 border-2 border-gray-200 rounded-lg px-3 text-base font-studentName focus:border-orange-500 focus:outline-none transition-colors"
                                            type="text"
                                            placeholder="Item 3"
                                        />
                                    </div>
                                    <button
                                        className={`flex justify-center items-center w-9 h-9 rounded-lg border-2 transition-all hover:scale-110 ${color(
                                            defaultValue[2]
                                        )} ${defaultValue[2] === 0 ? 'border-gray-300 bg-white' : defaultValue[2] === 1 ? 'border-green-600' : defaultValue[2] === 2 ? 'border-red-600' : 'border-yellow-500'}`}
                                        onClick={(e) => {
                                            incrementArray(2)
                                            setRefresh(refresh + 1)
                                            e.preventDefault()
                                            e.stopPropagation()
                                        }}
                                    >
                                        <span className={`text-base font-bold ${
                                            defaultValue[2] !== 4
                                                ? 'text-gray-600'
                                                : 'text-yellow-700'
                                        }`}>
                                            {defaultValue[2] === 4 ? '?' : defaultValue[2] === 1 ? '✓' : defaultValue[2] === 2 ? '✗' : ''}
                                        </span>
                                    </button>
                                </div>
                                )}
                                {itemN >= 4 && (
                                <div className="flex flex-row items-center gap-4">
                                    <button
                                        type="button"
                                        className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors flex-shrink-0 overflow-hidden p-0 min-w-[28px]"
                                        onClick={() => {
                                            setItemN(itemN - 1)
                                            setItem4('')
                                        }}
                                    >
                                        <svg
                                            className="h-4 w-4 fill-current text-gray-600"
                                            viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <title>Supprimer</title>
                                            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                                        </svg>
                                    </button>
                                    <div className="flex-1">
                                        <input
                                            value={item4}
                                            ref={ref4}
                                            onChange={(e) => {
                                                setItem4(e.target.value)
                                            }}
                                            className="h-10 w-full bg-gray-50 border-2 border-gray-200 rounded-lg px-3 text-base font-studentName focus:border-orange-500 focus:outline-none transition-colors"
                                            type="text"
                                            placeholder="Item 4"
                                        />
                                    </div>
                                    <button
                                        className={`flex justify-center items-center w-9 h-9 rounded-lg border-2 transition-all hover:scale-110 ${color(
                                            defaultValue[3]
                                        )} ${defaultValue[3] === 0 ? 'border-gray-300 bg-white' : defaultValue[3] === 1 ? 'border-green-600' : defaultValue[3] === 2 ? 'border-red-600' : 'border-yellow-500'}`}
                                        onClick={(e) => {
                                            incrementArray(3)
                                            setRefresh(refresh + 1)
                                            e.preventDefault()
                                            e.stopPropagation()
                                        }}
                                    >
                                        <span className={`text-base font-bold ${
                                            defaultValue[3] !== 4
                                                ? 'text-gray-600'
                                                : 'text-yellow-700'
                                        }`}>
                                            {defaultValue[3] === 4 ? '?' : defaultValue[3] === 1 ? '✓' : defaultValue[3] === 2 ? '✗' : ''}
                                        </span>
                                    </button>
                                </div>
                                )}
                                {itemN === 5 && (
                                <div className="flex flex-row items-center gap-4">
                                    <button
                                        type="button"
                                        className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors flex-shrink-0 overflow-hidden p-0 min-w-[28px]"
                                        onClick={() => {
                                            setItemN(itemN - 1)
                                            setItem5('')
                                        }}
                                    >
                                        <svg
                                            className="h-4 w-4 fill-current text-gray-600"
                                            viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <title>Supprimer</title>
                                            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                                        </svg>
                                    </button>
                                    <div className="flex-1">
                                        <input
                                            value={item5}
                                            ref={ref5}
                                            onChange={(e) => {
                                                setItem5(e.target.value)
                                            }}
                                            className="h-10 w-full bg-gray-50 border-2 border-gray-200 rounded-lg px-3 text-base font-studentName focus:border-orange-500 focus:outline-none transition-colors"
                                            type="text"
                                            placeholder="Item 5"
                                        />
                                    </div>
                                    <button
                                        className={`flex justify-center items-center w-9 h-9 rounded-lg border-2 transition-all hover:scale-110 ${color(
                                            defaultValue[4]
                                        )} ${defaultValue[4] === 0 ? 'border-gray-300 bg-white' : defaultValue[4] === 1 ? 'border-green-600' : defaultValue[4] === 2 ? 'border-red-600' : 'border-yellow-500'}`}
                                        onClick={(e) => {
                                            incrementArray(4)
                                            setRefresh(refresh + 1)
                                            e.preventDefault()
                                            e.stopPropagation()
                                        }}
                                    >
                                        <span className={`text-base font-bold ${
                                            defaultValue[4] !== 4
                                                ? 'text-gray-600'
                                                : 'text-yellow-700'
                                        }`}>
                                            {defaultValue[4] === 4 ? '?' : defaultValue[4] === 1 ? '✓' : defaultValue[4] === 2 ? '✗' : ''}
                                        </span>
                                    </button>
                                </div>
                                )}
                            </div>
                        </div>
                        {itemN < 5 && (
                        <div className="w-full max-w-2xl flex flex-row justify-center mb-3">
                            <button
                                type="submit"
                                className="flex flex-row items-center justify-center gap-2 px-5 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg border-2 border-gray-300 text-gray-700 font-studentName text-sm font-semibold transition-all hover:scale-105 shadow-sm"
                                onClick={(e) => {
                                    e.preventDefault()
                                    if (itemN <= 5) setItemN(itemN + 1)
                                    setTimeout(
                                        () => nextInputRef.current!.focus(),
                                        10
                                    )
                                }}
                            >
                                <img
                                    className="h-4 w-4"
                                    src={add}
                                    alt="ajouter"
                                />
                                Ajouter un item
                            </button>
                        </div>
                        )}
                    </div>

                    <div className="w-full max-w-2xl flex justify-center mt-4 mb-2">
                        {clickable ? (
                            <button
                                type="submit"
                                ref={submitButtonRef}
                                onClick={() => history.goBack()}
                                className="flex h-11 w-52 items-center justify-center bg-orange-500 hover:bg-orange-600 rounded-lg text-white text-base font-studentName font-bold shadow-custom transition-all hover:scale-105"
                            >
                                ✓ Créer la liste
                            </button>
                        ) : (
                            <div className="flex h-11 w-52 items-center justify-center bg-gray-300 rounded-lg text-gray-500 text-base font-studentName font-bold">
                                Créer la liste
                            </div>
                        )}
                    </div>
                </div>
            </form>
            <div className="flex-shrink-0 w-full h-12 nav-wrap">
                <NavBar 
                activeMenu="list"
                onHomeClick={handleHomeClick}
                />
            </div>
        </div>
    )
}
