import React, { useCallback, useContext, useState, ChangeEvent } from 'react'
import { withRouter, Redirect } from 'react-router'
import Firebase from 'firebase'
import { AuthContext } from '../Auth'
import add from '../images/add.png'
import femaleUser from '../images/femaleUser.png'
import lock from '../images/lock.png'
import classroom from '../images/classroom.png'

interface LoginProps {
    history: any
}

const Login = ({ history }: LoginProps) => {
    const [logInputValue, setLogInputValue] = useState('')
    const [passwordInputValue, setPasswordInputValue] = useState('')
    const [logging, setLogging] = useState(true)
    const [errorMessage, setErrorMessage] = useState('')

    const handleLogin = useCallback(
        async (event) => {
            event.preventDefault()
            const { email, password } = event.target.elements
            try {
                await Firebase.auth().signInWithEmailAndPassword(
                    email.value,
                    password.value
                )
                history.push('/')
            } catch (error) {
                alert(error)
            }
        },
        [history]
    )

    const { currentUser } = useContext(AuthContext)

    if (currentUser) {
        return <Redirect to="/" />
    }

    return (
        <div>
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
                                onSubmit={handleLogin}
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
                                            className="h-10 mt-3 w-full placeholder-gray-700 ml-5"
                                            name="email"
                                            type="email"
                                            placeholder="Email"
                                        />
                                    </div>
                                    <div className="w-8/12 border-b-2 border-gray-400 flex flex-row items-center hover:border-gray-600">
                                        <img
                                            className="w-8 h-8 mt-3"
                                            src={lock}
                                            alt=""
                                        />
                                        <input
                                            className="h-10 mt-3 w-full placeholder-gray-700 ml-5"
                                            name="password"
                                            type="password"
                                            placeholder="Password"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="flex h-10 w-48 self-center mt-5 bg-green-600 rounded text-white flex text-xl font-bold justify-center"
                                    >
                                        Se Connecter
                                    </button>
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
        </div>
    )
}

export default withRouter(Login)
