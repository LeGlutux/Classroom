import React, { useState, ChangeEvent, useContext } from 'react'
import group from '../../images/group.png'
import Firebase from '../../firebase'
import firebase from 'firebase/app'
import { AuthContext } from '../../Auth'
import { useGroups } from '../../hooks'

interface Props {
    onAddGroup: () => void
}
export default (props: Props) => {
    const [inputValue, setInputValue] = useState('')
    const db = Firebase.firestore()
    const { currentUser } = useContext(AuthContext)
    if (currentUser === null) return <div />

    return (
        <div className="flex flex-col items-center rounded mt-5 h-40 mx-6 bg-gray-100 shadow-custom mt-8">
            <form
                className="flex flex-col w-full h-full bg-transparent"
                onSubmit={(e) => {
                    if (inputValue !== '') {
                        setInputValue('')
                    }
                    db.collection('users')
                        .doc(currentUser.uid)
                        .update({
                            classes: firebase.firestore.FieldValue.arrayUnion(
                                inputValue
                            ),
                        })
                    props.onAddGroup()
                    e.preventDefault()
                    e.stopPropagation()
                }}
                action=""
            >
                <div className="flex flex-col h-full w-full items-center justify-around pb-4">
                    <div className="w-6/10 flex flex-row items-center hover:border-gray-600">
                        <img className="w-8 h-8 mt-3" src={group} alt="" />
                        <input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="h-10 mt-3 w-9/12 placeholder-gray-700 text-xl ml-5 bg-transparent border-b-2 border-gray-600"
                            type="text"
                            placeholder="Nom du groupe"
                        />
                    </div>
                    <button
                        type="submit"
                        className="flex h-10 w-48 self-center bg-orange-500 rounded text-white flex text-xl font-bold justify-center mt-5"
                    >
                        Ajouter le groupe
                    </button>
                </div>
            </form>
        </div>
    )
}
