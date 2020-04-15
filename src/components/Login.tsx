import React, { useCallback, useContext, useState, ChangeEvent } from 'react'
import { withRouter, Redirect } from 'react-router'
import Firebase from 'firebase'
import { AuthContext } from '../Auth'
import femaleUser from '../images/femaleUser.png'
import lock from '../images/lock.png'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import loginBackground from '../images/loginBackground.jpg'
import loginBackground2 from '../images/loginBackground2.jpg'
import loginBackground3 from '../images/loginBackground3.jpg'
import lucienBulleRonde from '../images/lucienBulleRonde.png'
import lucienNuage from '../images/lucienNuage.png'
import lucien from '../images/lucien.png'
import lucienCouleur from '../images/lucienCouleur.png'
import lucienRondOrange from '../images/lucienRondOrange.png'

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
        <div style={{ backgroundImage: `url(${loginBackground2})` }}>
            <div
                className={`bg-blue-400 w-full flex flex-col lg:(flex-row-reverse) xl:flex-row-reverse flex items-center ${
                    !logging ? 'invisible h-0' : 'h-screen'
                }`}
            >
                <div className="flex flex-col w-full items-center">
                    <div className="mt-12 text-6xl font-title">Thot Note</div>
                    <div className="h-32 w-8/12 pt-2">
                        {' '}
                        <img className="" src={lucienCouleur} alt="" />
                    </div>
                    <div className="w-full flex flex justify-center">
                        <div className="w-10/12 flex flex-row align-middle justify-between content-center rounded-lg h-64 mt-32">
                            <form
                                className="flex flex-col w-full"
                                onSubmit={handleLogin}
                                action=""
                            >
                                <div className="flex flex-col h-full justify-center w-full items-center">
                                    <div className="w-8/12 border-b-2 border-white flex flex-row items-center hover:border-gray-600">
                                        <img
                                            className="w-8 h-8 mt-3"
                                            src={femaleUser}
                                            alt=""
                                        />
                                        <input
                                            className="h-10 mt-3 w-full placeholder-gray-900 bg-transparent ml-5"
                                            name="email"
                                            type="email"
                                            placeholder="Email"
                                        />
                                    </div>
                                    <div className="w-8/12 border-b-2 border-white flex flex-row items-center hover:border-gray-600">
                                        <img
                                            className="w-8 h-8 mt-3"
                                            src={lock}
                                            alt=""
                                        />
                                        <input
                                            className="h-10 mt-3 w-full placeholder-gray-900 bg-transparent ml-5"
                                            name="password"
                                            type="password"
                                            placeholder="Password"
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
