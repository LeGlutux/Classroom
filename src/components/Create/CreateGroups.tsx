import React, { useState, useContext, useRef, useEffect } from 'react'
import Firebase from '../../firebase'
import firebase from 'firebase/app'
import { AuthContext } from '../../Auth'
import { IconCheck, IconUsers } from '../Icons'

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
                    <div className="flex flex-col h-full justify-around items-center w-full">
                        <div className="settings-title">
                            Ajoutez vos classes
                        </div>
                        <div className="field">
                            <IconUsers />
                            <input
                                ref={inputRef}
                                value={inputValue}
                                onChange={(e) =>
                                    setInputValue(e.target.value)
                                }
                                className="field-input"
                                type="text"
                                placeholder="Nom de la classe"
                            />
                        </div>
                        <div
                            className={`btn-disabled mt-6 ${
                                clickable ? 'hidden' : 'visible'
                            }`}
                        >
                            Ajouter le groupe
                        </div>
                        <button
                            type="submit"
                            className={`btn-primary mt-6 ${
                                clickable ? 'visible' : 'hidden'
                            }`}
                        >
                            Ajouter le groupe
                        </button>

                        <div
                            className={`absolute sm:ok-position1 ${
                                sent ? 'fade-out' : 'invisible'
                            }`}
                            style={{ color: 'var(--tn-ink)' }}
                        >
                            <IconCheck />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}
