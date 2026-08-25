import React, { useCallback } from 'react'
import { useHistory, Link } from 'react-router-dom'
import Firebase from '../firebase'
import lucienPlongeon from '../images/lucienPlongeon.png'
import { IconLock, IconMail, IconUser } from './Icons'

const SignUp = () => {
    const history = useHistory()
    const db = Firebase.firestore()
    const handleSignUp = useCallback(
        async (event) => {
            event.preventDefault()
            const { email, password, name } = event.target.elements

            try {
                const { user } =
                    await Firebase.auth().createUserWithEmailAndPassword(
                        email.value,
                        password.value
                    )
                if (user === null)
                    throw new Error('User is undefined after signup')
                await db
                    .collection('users')
                    .doc(user.uid)
                    .set({
                        id: user.uid,
                        email: user.email,
                        userName: name.value,
                        classes: [] as string[],
                        periodes: [new Date()],
                        runningPeriode: 1 as number,
                        version: 0,
                        icons: [1, 2, 3, 4, 0, 0],
                        positiveIcons: [0, 0, 0, 0, 0, 0],
                        postIt: [],
                        tutorialCompleted: false,
                    })

                history.push('/')
            } catch (error) {
                alert(error)
            }
        },
        [history, db]
    )

    return (
        <div className="auth-page">
            <div className="auth-wrap">
                <img className="auth-illu" src={lucienPlongeon} alt="" />
                <div className="auth-card">
                    <div className="auth-title">Thòt Note</div>
                    <form onSubmit={handleSignUp} action="">
                        <label className="auth-field">
                            <IconUser />
                            <input
                                name="name"
                                type="text"
                                placeholder="Prénom"
                                autoComplete="given-name"
                            />
                        </label>
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
                                autoComplete="new-password"
                            />
                        </label>
                        <button type="submit" className="settings-btn">
                            Créer un compte
                        </button>
                        <div className="auth-alt">
                            <Link to="/login">Déjà inscrit ?</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default SignUp
