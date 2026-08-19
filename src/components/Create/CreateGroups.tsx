import React, { useState, useContext, useRef, useEffect } from 'react'
import Firebase from '../../firebase'
import firebase from 'firebase/app'
import { AuthContext } from '../../Auth'

interface Props {
    onAddGroup: () => void
}
export default (props: Props) => {
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
        <form
            className="flex flex-col w-full bg-transparent"
            onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                if (inputValue !== '' && inputValue.length <= 9) {
                    const name = inputValue
                    setInputValue('')

                    db.collection('users')
                        .doc(currentUser.uid)
                        .update({
                            postIt: firebase.firestore.FieldValue.arrayUnion({
                                classe: name,
                                content: '',
                            }),
                            classes:
                                firebase.firestore.FieldValue.arrayUnion(name),
                        })
                    props.onAddGroup()
                } else if (inputValue === '') {
                    alert('Eh ! tu ferais mieux de nommer cette classe.')
                } else if (inputValue.length >= 10) {
                    alert("Désolé, ce nom est trop long. Essaye d'abréger.")
                }
            }}
            action=""
        >
            <label className="modal-field" style={{ marginTop: 0 }}>
                <span className="modal-label">Nom de la classe</span>
                <input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="modal-input"
                    type="text"
                    placeholder="Ex. 6A"
                />
            </label>
            <button
                type="submit"
                className={`settings-btn ${clickable ? '' : 'is-disabled'}`}
            >
                Ajouter le groupe
            </button>
        </form>
    )
}
