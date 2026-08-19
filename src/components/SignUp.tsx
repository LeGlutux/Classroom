import React, { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import Firebase from '../firebase'
import { Link } from 'react-router-dom'
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
                        postIt: [],
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
            <div className="flex flex-col items-center">
                <h1 className="auth-brand">Thòt Note</h1>
                <img className="auth-illustration" src={lucienPlongeon} alt="" />
            </div>
            <div className="card auth-card">
                <form className="auth-form" onSubmit={handleSignUp} action="">
                    <label className="field">
                        <IconUser />
                        <input
                            name="name"
                            type="text"
                            placeholder="Prénom"
                        />
                    </label>
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
                        Créer un compte
                    </button>
                    <Link to="/login" className="auth-link">
                        Déjà inscrit·e ?
                    </Link>
                </form>
            </div>
        </div>
    )
}

export default SignUp
