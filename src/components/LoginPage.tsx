import React, { useState, ChangeEvent } from 'react'
import add from '../images/add.png'
import femaleUser from '../images/femaleUser.png'
import lock from '../images/lock.png'
import { ImageBackground, StyleSheet, Text, View } from 'react-native'
import classroom from '../images/classroom.png'
import { Router, Switch } from 'react-router-dom'

interface LoginPageProps {
    onLog: () => void
    signin: string
}

export default ({ onLog, signin }: LoginPageProps) => {
    const [logInputValue, setLogInputValue] = useState('')
    const [passwordInputValue, setPasswordInputValue] = useState('')
    const [logging, setLogging] = useState(true)
    const [errorMessage, setErrorMessage] = useState('')

    return (
        <div
            className={`w-full flex flex-col lg:(flex-row-reverse) xl:flex-row-reverse flex items-center ${
                !logging ? 'invisible h-0' : 'h-screen'
            }`}
        >
            <div className="flex flex-col w-full bg-blue-200">
                <div className="w-full bg-blue-200 flex flex justify-center">
                    <div className="w-11/12 flex flex-row align-middle justify-between content-center rounded-lg h-64 bg-white mt-16">
                        <form
                            className="flex flex-col w-full"
                            onSubmit={(e) => {
                                if (
                                    logInputValue !== '' &&
                                    passwordInputValue !== ''
                                ) {
                                    setLogInputValue('')
                                    setPasswordInputValue('')
                                    onLog()
                                    setLogging(false)
                                    e.preventDefault()
                                    e.stopPropagation()
                                } else {
                                    setLogInputValue('')
                                    setPasswordInputValue('')
                                    setErrorMessage(
                                        'Indentifiant ou Mot de Passe incorect'
                                    )
                                    e.preventDefault()
                                    e.stopPropagation()
                                }
                            }}
                            action=""
                        >
                            <div className="flex flex-col h-full justify-center w-full items-center">
                                <div className="w-8/12 border-b-2 border-gray-400 flex flex-row items-center hover:border-gray-600">
                                    <img
                                        className="w-8 h-8 mt-3"
                                        src={femaleUser}
                                        alt=""
                                    />
                                    <input
                                        value={logInputValue}
                                        onChange={(e) =>
                                            setLogInputValue(e.target.value)
                                        }
                                        className="h-10 mt-3 w-full placeholder-gray-700 ml-5"
                                        type="text"
                                        placeholder="Identifiant"
                                    />
                                </div>
                                <div className="w-8/12 border-b-2 border-gray-400 flex flex-row items-center hover:border-gray-600">
                                    <img
                                        className="w-8 h-8 mt-3"
                                        src={lock}
                                        alt=""
                                    />
                                    <input
                                        value={passwordInputValue}
                                        onChange={(e) =>
                                            setPasswordInputValue(
                                                e.target.value
                                            )
                                        }
                                        className="h-10 mt-3 w-full placeholder-gray-700 ml-5"
                                        type="text"
                                        placeholder="Mot de Passe"
                                    />
                                </div>
                                <input
                                    type="submit"
                                    className="flex h-10 w-48 self-center mt-5 bg-green-600 rounded text-white flex text-xl font-bold justify-center"
                                    src={add}
                                    value="Se Connecter"
                                />
                                <div>{signin}</div>
                            </div>
                            <div className="h-8 flex text-center w-full justify-center text-red-600">
                                {errorMessage}
                            </div>
                        </form>
                    </div>
                </div>{' '}
                <img
                    className="bg-blue-200 lg:w-1/2 lg:h-1/2"
                    src={classroom}
                    alt=""
                />
            </div>
        </div>
    )
}
