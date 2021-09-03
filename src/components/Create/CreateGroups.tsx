import React, { useState, useContext, useRef } from 'react'
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
    const inputRef= useRef<HTMLInputElement>(null)

    return (
        <div className='flex flex-col h-full'>
            <form
                className="flex flex-col w-full h-full bg-transparent"
                onSubmit={(e) => {
                    if (inputValue !== '') {
                        setInputValue('')

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
                    }
                }}
                action=""
            >
                <div className="flex flex-col h-full items-center pb-4 justify-center">
                    <div className='flex flex-col h-full justify-around items-center'>
                        <div className='relative top-0 font-title text-3xl'>Ajoutez vos classes</div>
                        <div className="flex flex-row items-center justify-center hover:border-gray-600 xl:w-full"
                            >
                            <img className="w-8 h-8 mt-3" src={group} alt="" />
                            <div className="w-9/12 flex flex-col hover:border-gray-600">
                                <input
                                    ref={inputRef}
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    className="h-10 z-50 placeholder-gray-700 ml-5 bg-transparent border-b-2 border-gray-600 text-lg xl:text-center"
                                    type="text"
                                    placeholder="Nom du groupe"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="flex h-8 w-40 self-center bg-orange-500 rounded text-white text-lg font-bold justify-center my-3"
                        >
                            Ajouter le groupe
                        </button>

                        <div
                            className={`absolute ok-position1 w-10 h-10 ${sent ? 'fade-out' : 'invisible'
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
