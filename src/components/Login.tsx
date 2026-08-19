import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Redirect, useHistory } from 'react-router-dom'
import Firebase from '../firebase'
import { AuthContext } from '../Auth'
import { Link } from 'react-router-dom'
import lucienEtMonstre from '../images/lucienEtMonstre.png'
import LoadingScreen from './LoadingScreen'
import { IconLock, IconMail } from './Icons'

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
    const { currentUser } = useContext(AuthContext)

    if (currentUser) {
        return <Redirect to="/" />
    }

    if (!displayed) {
        return <LoadingScreen standalone message="Chargement des données" />
    }

    return (
        <div className="auth-page">
            <div className="flex flex-col items-center">
                <h1 className="auth-brand">Thòt Note</h1>
                <img
                    className="auth-illustration"
                    src={lucienEtMonstre}
                    alt=""
                />
            </div>
            <div className="card auth-card">
                <form className="auth-form" onSubmit={handleLogin} action="">
                    <label className="field">
                        <IconMail />
                        <input name="email" type="email" placeholder="Email" />
                    </label>
                    <label className="field">
                        <IconLock />
                        <input
                            name="password"
                            type="password"
                            placeholder="Mot de passe"
                        />
                    </label>
                    <button type="submit" className="btn-primary">
                        Se connecter
                    </button>
                    <Link to="/signup" className="auth-link">
                        Créer un compte
                    </Link>
                </form>
            </div>
        </div>
    )
}

export default Login
