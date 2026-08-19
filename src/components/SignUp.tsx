import React, { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import Firebase from '../firebase'
import femaleUser from '../images/femaleUser.png'
import lock from '../images/lock.png'
import { Link } from 'react-router-dom'
import lucienPlongeon from '../images/lucienPlongeon.png'
import bandeauCrayon from '../images/bandeauCrayon.png'
import mail from '../images/mail.png'

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
        <div className="h-screen bg-white flex flex-col xl:flex-row xl:items-center">
            <div className="w-full xl:w-4 xl:invisible">
                {' '}
                <img src={bandeauCrayon} alt="" />{' '}
            </div>
            <img
                className="flex w-5/12 ml-20 mt-8 xl:w-auto xl:big"
                src={lucienPlongeon}
                alt=""
            />
            <div
                className={`w-full flex flex-col lg:(flex-row-reverse) xl:flex-row-reverse items-center `}
            >
                <div className="flex flex-col w-full">
                    <div className="w-full flex items-center flex-col">
                        <div className="font-title font-semibold text-3xl tracking-tight">
                            Thòt Note
                        </div>

                        <div className="w-10/12 flex flex-row content-center rounded-lg h-full bg-transparent">
                            <form
                                className="flex flex-col w-full bg-transparent"
                                onSubmit={handleSignUp}
                                action=""
                            >
                                <div className="flex flex-col h-full justify-center w-full items-center">
                                    <div className="w-8/12 border-b-2 border-gray-600 flex flex-row items-center hover:border-gray-600">
                                        <img
                                            className="w-8 h-8 xl:w-12 xl:h-12 mt-3"
                                            src={femaleUser}
                                            alt=""
                                        />
                                        <input
                                            name="name"
                                            type="name"
                                            placeholder="Prénom"
                                            className="h-10 mt-3 w-full placeholder-gray-900 text-base ml-5 bg-transparent"
                                        />
                                    </div>
                                    <div className="w-8/12 border-b-2 border-gray-600 flex flex-row items-center hover:border-gray-600">
                                        <img
                                            className="w-8 h-8 xl:w-12 xl:h-12 mt-3"
                                            src={mail}
                                            alt=""
                                        />
                                        <input
                                            name="email"
                                            type="email"
                                            placeholder="Email"
                                            className="h-10 mt-3 w-full placeholder-gray-900 text-base ml-5 bg-transparent"
                                        />
                                    </div>
                                    <div className="w-8/12 border-b-2 border-gray-600 flex flex-row items-center hover:border-gray-600">
                                        <img
                                            className="w-8 h-8 xl:w-12 xl:h-12 mt-3"
                                            src={lock}
                                            alt=""
                                        />
                                        <input
                                            name="password"
                                            type="password"
                                            placeholder="Mot de Passe"
                                            className="h-10 mt-3 w-full placeholder-gray-900 text-base ml-5 bg-transparent"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="flex h-10 px-4 self-center mt-5 bg-orange-500 rounded text-white text-base font-bold items-center justify-center whitespace-nowrap"
                                    >
                                        Créer un Compte
                                    </button>
                                    <div className="flex justify-end self-end mt-4 mr-4">
                                        <div className="flex self-end text-xs xl:text-xl">
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

export default SignUp
