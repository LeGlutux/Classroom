import React, { useState, ChangeEvent } from 'react'
import add from '../images/add.png'
import femaleUser from '../images/femaleUser.png'
import lock from '../images/lock.png'
import { ImageBackground, StyleSheet, Text, View } from 'react-native'

export default () => {
    const [groups, setGroups] = useState([{ name: 'Tous', isActive: false }])
    const [nameInputValue, setNameInputValue] = useState('')
    const [surnameInputValue, setSurnameInputValue] = useState('')
    const [studentGroups, setStudentGroups] = useState([])
    return (
        <div className="w-full h-screen flex flex-col flex items-center px-2">
            <div className="w-full h-screen bg-blue-200 flex flex justify-center p-2">
                {' '}
                <div className="w-11/12 flex flex-row align-middle justify-between content-center rounded-lg h-64 bg-white mt-16">
                    <form
                        className="flex flex-col w-full"
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
                        <div className="flex flex-col h-full justify-center w-full items-center">
                            <div className="w-8/12 border-b-2 border-gray-400 flex flex-row items-center">
                                <img
                                    className="w-8 h-8 mt-3"
                                    src={femaleUser}
                                    alt=""
                                />
                                <input
                                    value={nameInputValue}
                                    onChange={(e) =>
                                        setNameInputValue(e.target.value)
                                    }
                                    className="h-10 mt-3 w-full placeholder-gray-700"
                                    type="text"
                                    placeholder="   Identifiant"
                                />
                            </div>
                            <div className="w-8/12 border-b-2 border-gray-400 flex flex-row items-center">
                                <img
                                    className="w-8 h-8 mt-3"
                                    src={lock}
                                    alt=""
                                />
                                <input
                                    value={surnameInputValue}
                                    onChange={(e) =>
                                        setSurnameInputValue(e.target.value)
                                    }
                                    className="h-10 mt-3 w-full placeholder-gray-700"
                                    type="text"
                                    placeholder="   Mot de Passe"
                                />
                            </div>
                            <input
                                type="button"
                                className="flex h-10 w-48 self-center mt-5 bg-green-600 rounded text-white flex text-xl font-bold justify-center"
                                src={add}
                                value="Se Connecter"
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
