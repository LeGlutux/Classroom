import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Redirect, useHistory, Link } from 'react-router-dom'
import Firebase from '../firebase'
import { AuthContext } from '../Auth'
import lucienEtMonstre from '../images/lucienEtMonstre.png'
import { IconLock, IconMail } from './Icons'
import Loader from './Loader'
import { openInstallApp } from './InstallApp'

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
        return () => {
            clearTimeout(timer)
        }
    }, [])
    const { currentUser, authReady } = useContext(AuthContext)

    if (!authReady) {
        return (
            <div className="flex flex-col items-center justify-center absolute w-full h-full mb-12 bg-white">
                <div className="empty-title">Chargement des données</div>
                <Loader />
            </div>
        )
    }

    if (currentUser) {
        return <Redirect to="/" />
    }

    return (
        <div>
            {!displayed && (
                <div className="flex flex-col items-center justify-center absolute w-full h-full mb-12 bg-white">
                    <div className="empty-title">Chargement des données</div>
                    <Loader />
                </div>
            )}
            <div className="auth-page">
                <div className="auth-wrap">
                    <img
                        className="auth-illu"
                        src={lucienEtMonstre}
                        alt=""
                    />
                    <div className="auth-card">
                        <div className="auth-title">Thòt Note</div>
                        <form onSubmit={handleLogin} action="">
                            <label className="auth-field">
                                <IconMail />
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="Email"
                                    autoComplete="email"
                                />
                            </label>
                            <label className="auth-field">
                                <IconLock />
                                <input
                                    name="password"
                                    type="password"
                                    placeholder="Mot de passe"
                                    autoComplete="current-password"
                                />
                            </label>
                            <button type="submit" className="settings-btn">
                                Se connecter
                            </button>
                            <div className="auth-alt">
                                <Link to="/signup">Créer un compte</Link>
                            </div>
                            <button
                                type="button"
                                className="auth-install"
                                onClick={() => {
                                    openInstallApp()
                                }}
                            >
                                Télécharger l’app
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
