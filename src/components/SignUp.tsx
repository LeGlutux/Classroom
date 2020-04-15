import React, { useCallback, useState } from 'react'
import { withRouter } from 'react-router'
import Firebase from 'firebase'
import femaleUser from '../images/femaleUser.png'
import lock from '../images/lock.png'
import classroom from '../images/classroom.png'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import signUpBackground from '../images/signUpBackground.jpg'

interface SignUpProps {
    history: any
}

const SignUp = ({ history }: SignUpProps) => {
    const [id, setId] = useState<string | null>('error')
    const db = Firebase.firestore()
    const handleSignUp = useCallback(
        async (event) => {
            event.preventDefault()
            const { email, password } = event.target.elements
            try {
                await Firebase.auth()
                    .createUserWithEmailAndPassword(email.value, password.value)
                    .then(() => {
                        const user = Firebase.auth().currentUser
                        db.collection('users').doc(user?.uid).set({
                            id: user?.uid,
                            email: user?.email,
                        })
                    })

                history.push('/')
            } catch (error) {
                alert(error)
            }
        },
        [history]
    )

    return (
        <div
            className="h-screen"
            style={{ backgroundImage: `url(${signUpBackground})` }}
        >
            <div
                className={`w-full flex flex-col lg:(flex-row-reverse) xl:flex-row-reverse flex items-center `}
            >
                <div className="flex flex-col w-full">
                    <div className="w-full flex justify-center">
                        <div className="w-10/12 flex flex-row align-middle justify-between content-center rounded-lg h-64 bg-white mt-16">
                            <form
                                className="flex flex-col w-full"
                                onSubmit={handleSignUp}
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
                                            name="email"
                                            type="email"
                                            placeholder="Email"
                                            className="h-10 mt-3 w-full placeholder-gray-700 ml-5"
                                        />
                                    </div>
                                    <div className="w-8/12 border-b-2 border-gray-400 flex flex-row items-center hover:border-gray-600">
                                        <img
                                            className="w-8 h-8 mt-3"
                                            src={lock}
                                            alt=""
                                        />
                                        <input
                                            name="password"
                                            type="password"
                                            placeholder="Password"
                                            className="h-10 mt-3 w-full placeholder-gray-700 ml-5"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="flex h-10 w-48 self-center mt-5 bg-blue-700 rounded text-white flex text-xl font-bold justify-center"
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
                    <img
                        className="w-64 h-64 flex self-center"
                        src={classroom}
                        alt=""
                    />
                </div>
            </div>
        </div>
    )
}

export default withRouter(SignUp)
