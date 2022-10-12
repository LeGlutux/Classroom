import React, { useState, useContext, useRef, useEffect } from 'react'
import group from '../../images/group.png'
import Firebase from '../../firebase'
import firebase from 'firebase/app'
import { AuthContext } from '../../Auth'
import ok from '../../images/ok.png'

interface Props {
    onAddGroup: () => void
}
export default (props: Props) => {
    const [sent, setSent] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const db = Firebase.firestore()
    const { currentUser } = useContext(AuthContext)
    if (currentUser === null) return <div />
    const inputRef = useRef<HTMLInputElement>(null)

    const [clickable, setClickable] = useState(false)

    useEffect(() => {
        if (inputValue !== '') setClickable(true)
        else setClickable(false)
    }, [inputValue])

    return (
        <div className="flex flex-col h-full">
            <form
                className="flex flex-col w-full h-full bg-transparent"
                onSubmit={(e) => {
                    if (inputValue !== '' && inputValue.length <= 9) {
                        setInputValue('')

                        db.collection('users')
                            .doc(currentUser.uid)
                            .update({
                                postIt: firebase.firestore.FieldValue.arrayUnion(
                                    { classe: inputValue, content: '' }
                                ),
                                classes:
                                    firebase.firestore.FieldValue.arrayUnion(
                                        inputValue
                                    ),
                            })
                        props.onAddGroup()
                        setSent(true)
                        setTimeout(() => setSent(false), 1000)
                        clearTimeout()
                        e.preventDefault()
                        e.stopPropagation()
                    }
                    if (inputValue === '') {
                        alert('Eh ! tu ferais mieux de nommer cette classe.')
                        e.preventDefault()
                        e.stopPropagation()
                    }
                    if (inputValue.length >= 10) {
                        alert("Désolé, ce nom est trop long. Essaye d'abréger.")
                        e.preventDefault()
                        e.stopPropagation()
                    }
                }}
                action=""
            >
                <div className="flex flex-col h-full items-center pb-4 justify-center">
                    <div className="flex flex-col h-full justify-around items-center">
                        <div className="relative top-0 font-title text-3xl">
                            Ajoutez vos classes
                        </div>
                        <div className="flex flex-row items-center justify-center hover:border-gray-600 xl:w-full">
                            <img className="w-8 h-8 mt-3" src={group} alt="" />
                            <div className="w-9/12 flex flex-col hover:border-gray-600">
                                <input
                                    ref={inputRef}
                                    value={inputValue}
                                    onChange={(e) =>
                                        setInputValue(e.target.value)
                                    }
                                    className="h-10 z-50 placeholder-gray-700 ml-5 bg-transparent border-b-2 border-gray-600 text-lg xl:text-center"
                                    type="text"
                                    placeholder="Nom de la classe"
                                />
                            </div>
                        </div>
                        <div
                            className={`flex h-12 w-40 self-center pt-2 mt-6 bg-gray-300 rounded text-gray-100 text-lg font-bold justify-center ${
                                clickable ? 'hidden' : 'visible'
                            }`}
                        >
                            Ajouter le groupe
                        </div>
                        <button
                            type="submit"
                            className={`flex h-12 w-40 self-center pt-2 mt-6 bg-orange-500 rounded text-white text-lg font-bold justify-center ${
                                clickable ? 'visible' : 'hidden'
                            }`}
                        >
                            Ajouter le groupe
                        </button>

                        <div
                            className={`absolute sm:ok-position1 w-10 h-10 ${
                                sent ? 'fade-out' : 'invisible'
                            }`}
                        >
                            <img src={ok} alt="ok" />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}
