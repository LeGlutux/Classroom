import React, { useCallback, useState } from 'react'
import { withRouter, useHistory } from 'react-router'
import Firebase from 'firebase'
import femaleUser from '../images/femaleUser.png'
import lock from '../images/lock.png'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import lucienPlongeon from '../images/lucienPlongeon.png'
import bandeauCrayon from '../images/bandeauCrayon.png'
import mail from '../images/mail.png'

const func = () => {
    const name = 'leo'
    return { name, birthsdate: 'december', age: '21' }
}
const o = { name: 'leo', birthsdate: 'december', age: '21' }
const { name: prenom, age } = o

const SignUp = () => {
    const history = useHistory()
    const [id, setId] = useState<string | null>('error')
    const db = Firebase.firestore()
    const handleSignUp = useCallback(
        async (event) => {
            event.preventDefault()
            const { email, password } = event.target.elements

            try {
                const {
                    user,
                } = await Firebase.auth().createUserWithEmailAndPassword(
                    email.value,
                    password.value
                )
                if (user === null)
                    throw new Error('User is undefined after signup')
                await db
                    .collection('users')
                    .doc(user.uid)
                    .set({ id: user.uid, email: user.email })

                history.push('/')
            } catch (error) {
                alert(error)
            }
        },
        [history]
    )

    return (
        <div className="h-screen bg-gray-300">
            <div className="w-full">
                {' '}
                <img src={bandeauCrayon} alt="" />{' '}
            </div>
            <img
                className="flex self-center w-1/2 ml-12 mt-8"
                src={lucienPlongeon}
                alt=""
            />
            <div
                className={`w-full flex flex-col lg:(flex-row-reverse) xl:flex-row-reverse flex items-center `}
            >
                <div className="flex flex-col w-full">
                    <div className="w-full flex items-center flex-col">
                        <div className=" font-title text-6xl mt-6">
                            Thot Note
                        </div>

                        <div className="w-10/12 flex flex-row content-center rounded-lg h-64 bg-transparent">
                            <form
                                className="flex flex-col w-full bg-transparent"
                                onSubmit={handleSignUp}
                                action=""
                            >
                                <div className="flex flex-col h-full justify-center w-full items-center">
                                    <div className="w-8/12 border-b-2 border-gray-600 flex flex-row items-center hover:border-gray-600">
                                        <img
                                            className="w-8 h-8 mt-3"
                                            src={femaleUser}
                                            alt=""
                                        />
                                        <input
                                            name="Prénom"
                                            type="Prénom"
                                            placeholder="Prénom"
                                            className="h-10 mt-3 w-full placeholder-gray-900 ml-5 bg-transparent"
                                        />
                                    </div>
                                    <div className="w-8/12 border-b-2 border-gray-600 flex flex-row items-center hover:border-gray-600">
                                        <img
                                            className="w-8 h-8 mt-3"
                                            src={mail}
                                            alt=""
                                        />
                                        <input
                                            name="email"
                                            type="email"
                                            placeholder="Email"
                                            className="h-10 mt-3 w-full placeholder-gray-900 ml-5 bg-transparent"
                                        />
                                    </div>
                                    <div className="w-8/12 border-b-2 border-gray-600 flex flex-row items-center hover:border-gray-600">
                                        <img
                                            className="w-8 h-8 mt-3"
                                            src={lock}
                                            alt=""
                                        />
                                        <input
                                            name="password"
                                            type="password"
                                            placeholder="Mot de Passe"
                                            className="h-10 mt-3 w-full placeholder-gray-900 ml-5 bg-transparent"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="flex h-10 w-48 self-center mt-5 bg-orange-500 rounded text-white flex text-xl font-bold justify-center"
                                    >
                                        Créer un Compte
                                    </button>
                                    <div className="flex justify-end self-end mt-4 mr-4">
                                        <div className="flex self-end text-xs">
                                            <Link
                                                to="/login"
                                                className="text-blue-700"
                                            >
                                                Déjà inscrit ?
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>{' '}
                </div>
            </div>
        </div>
    )
}

export default withRouter(SignUp)
