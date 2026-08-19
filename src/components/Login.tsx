import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Redirect, useHistory } from 'react-router-dom'
import Firebase from '../firebase'
import { AuthContext } from '../Auth'
import lock from '../images/lock.png'
import loader_image from '../images/loader.gif'
import { Link } from 'react-router-dom'
import lucienEtMonstre from '../images/lucienEtMonstre.png'
import mail from '../images/mail.png'

const Login = () => {
    const history = useHistory()
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
    const [displayed, setDisplayed] = useState(false)

    useEffect(() => {
        setDisplayed(false)
        const timer = setTimeout(() => setDisplayed(true), 2000)
        
        // Cleanup function to prevent memory leak
        return () => {
            clearTimeout(timer)
        }
    }, [])
    const { currentUser } = useContext(AuthContext)

    if (currentUser) {
        return <Redirect to="/" />
    }

    return (
        <div>
            {!displayed && (
                <div className="flex flex-col items-center justify-center absolute w-full h-full mb-12 bg-white">
                    <div className="empty-title">Chargement des données</div>
                    <div className="w-64 h-64 mt-8 xl:w-64 xl:h-64">
                        <img src={loader_image} alt="" />
                    </div>
                </div>
            )}
            <div className="bg-white h-screen w-full flex flex-col items-center">
                <div className="flex flex-col w-full items-center">
                    <div className="text-3xl font-title font-semibold pt-6 xl:mt-10 tracking-tight">
                        Thòt Note
                    </div>
                    <div className="flex w-full flex-col items-center xl:flex-row">
                        <div className="h-70 w-8/12 flex justify-center xl:2big">
                            <img
                                className="h-full"
                                src={lucienEtMonstre}
                                alt=""
                            />
                        </div>
                        <div className="w-full flex justify-center">
                            <div className="w-10/12 flex flex-row align-middle justify-between content-center rounded-lg h-full xl:mt-32">
                                <form
                                    className="flex flex-col w-full"
                                    onSubmit={handleLogin}
                                    action=""
                                >
                                    <div className="flex flex-col h-full w-full items-center xl:mt-10">
                                        <div className="w-8/12 border-b-2 border-gray-600 flex flex-row items-center hover:border-gray-600 xl:mt-12">
                                            <img
                                                className="w-8 h-8 mt-3 xl:w-12 mb-1 xl:mt-1 xl:h-12"
                                                src={mail}
                                                alt=""
                                            />
                                            <input
                                                className="h-10 mt-3 w-full placeholder-gray-900 bg-transparent ml-5 text-base"
                                                name="email"
                                                type="email"
                                                placeholder="Email"
                                            />
                                        </div>
                                        <div className="w-8/12 border-b-2 border-gray-600 flex flex-row items-center hover:border-gray-600 xl:mt-12">
                                            <img
                                                className="w-8 h-8 mt-3 xl:w-12  xl:mt-1 xl:h-12 mb-1"
                                                src={lock}
                                                alt=""
                                            />
                                            <input
                                                className="h-10 mt-3 w-full placeholder-gray-900 bg-transparent ml-5 text-base"
                                                name="password"
                                                type="password"
                                                placeholder="Mot de Passe"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="flex h-10 w-48 self-center mt-5 bg-orange-500 rounded items-center text-white text-base font-bold justify-center shadow"
                                        >
                                            Se Connecter
                                        </button>
                                        <div className="flex justify-end self-end mt-4 mr-4">
                                            <div className="flex self-end text-xs">
                                                <Link
                                                    to="/signup"
                                                    className="text-blue-800 xl:text-xl"
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
        </div>
    )
}

export default Login
