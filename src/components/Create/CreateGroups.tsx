import React, { useState, useContext } from 'react'
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

    return (
        <div className="flex flex-col items-center rounded h-40 mx-6 bg-gray-100 shadow-custom mt-8 xl:w-5/12 xl:h-64">
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
                    setSent(true)
                    setTimeout(() => setSent(false), 1000)
                    clearTimeout()
                    e.preventDefault()
                    e.stopPropagation()
                }}
                action=""
            >
                <div className="flex flex-col h-full w-full items-center justify-around pb-4 relative">
                    <div
                        className={`absolute right-0 top-25 w-10 h-10 ${sent ? 'fade-out' : 'invisible'
                            }`}
                    >
                        <img src={ok} alt="ok" />
                    </div>
                    <div className="w-6/10 flex flex-row items-center hover:border-gray-600 xl:w-9/12">
                        <img className="w-8 h-8 mt-3" src={group} alt="" />
                        <input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="h-10 mt-3 w-9/12 placeholder-gray-700 text-lg ml-5 bg-transparent border-b-2 border-gray-600 xl:text-center"
                            type="text"
                            placeholder="Nom du groupe"
                        />
                    </div>
                    <button
                        type="submit"
                        className="flex h-8 w-40 self-center bg-orange-500 rounded text-white text-lg font-bold justify-center mt-2"
                    >
                        Ajouter le groupe
                    </button>
                </div>
            </form>
        </div>
    )
}
