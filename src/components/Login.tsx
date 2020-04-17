import React, { useCallback, useContext, useState, ChangeEvent } from 'react'
import { withRouter, Redirect } from 'react-router'
import Firebase from 'firebase'
import { AuthContext } from '../Auth'
import lock from '../images/lock.png'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import lucienEtMonstre from '../images/lucienEtMonstre.png'
import mail from '../images/mail.png'

interface LoginProps {
    history: any
}

const Login = ({ history }: LoginProps) => {
    const [logInputValue, setLogInputValue] = useState('')
    const [passwordInputValue, setPasswordInputValue] = useState('')
    const [logging, setLogging] = useState(true)

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
            <div className="bg-gray-300 h-screen w-full flex flex-col items-center h-full">
                <div className="flex flex-col w-full items-center">
                    <div className="mt-6 text-6xl font-title flex text-base">
                        Thot Note
                    </div>
                    <div className="h-100 w-8/12 flex justify-center">
                        {' '}
                        <img className="h-full" src={lucienEtMonstre} alt="" />
                    </div>
                    <div className="w-full flex flex justify-center">
                        <div className="w-10/12 flex flex-row align-middle justify-between content-center rounded-lg h-64">
                            <form
                                className="flex flex-col w-full"
                                onSubmit={handleLogin}
                                action=""
                            >
                                <div className="flex flex-col h-full w-full items-center">
                                    <div className="w-8/12 border-b-2 border-gray-600 flex flex-row items-center hover:border-gray-600">
                                        <img
                                            className="w-8 h-8 mt-3"
                                            src={mail}
                                            alt=""
                                        />
                                        <input
                                            className="h-10 mt-3 w-full placeholder-gray-900 bg-transparent ml-5"
                                            name="email"
                                            type="email"
                                            placeholder="Email"
                                        />
                                    </div>
                                    <div className="w-8/12 border-b-2 border-gray-600 flex flex-row items-center hover:border-gray-600">
                                        <img
                                            className="w-8 h-8 mt-3"
                                            src={lock}
                                            alt=""
                                        />
                                        <input
                                            className="h-10 mt-3 w-full placeholder-gray-900 bg-transparent ml-5"
                                            name="password"
                                            type="password"
                                            placeholder="Mot de Passe"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="flex h-10 w-48 self-center mt-5 bg-orange-500 rounded text-white flex text-xl font-bold justify-center shadow"
                                    >
                                        Se Connecter
                                    </button>
                                    <div className="flex justify-end self-end mt-4 mr-4">
                                        <div className="flex self-end text-xs">
                                            <Link
                                                to="/signup"
                                                className="text-blue-800"
                                            >
                                                Créer un Compte
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default withRouter(Login)
