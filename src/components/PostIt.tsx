import React, { useRef, useState, useEffect } from 'react'
import Firebase from '../firebase'
import useOnClickOutside from '../hooks'

interface PostItProps {
    currentUserId: string
    classe: string
    content: string
    currentClasse: string
    setDisplay: React.Dispatch<React.SetStateAction<boolean>>
    postIts: { classe: string; content: string }[]
    index: number
}
export default (props: PostItProps) => {
    const db = Firebase.firestore()
    const [confirmErase, setConfirmErase] = useState(false)
    const [textInputValue, setTextInputValue] = useState(props.content)
    const handleErase = () => {
        setTextInputValue('')
    }

    const handleSave = () => {
        if (props.classe !== 'tous') {
            const newPostIts = props.postIts
            newPostIts[props.index] = {
                classe: props.classe,
                content: textInputValue,
            }
            db.collection('users')
                .doc(props.currentUserId)
                .update({ postIt: newPostIts })
        }
    }

    const handleClose = () => {
        props.setDisplay(false)
    }

    const ref = useRef(null)
    const handleClickOutside = () => {
        handleClose()
        handleSave()
    }
    useOnClickOutside(ref, handleClickOutside)

    return (
        <div
            className={`flex justify-center align-middle items-center w-full h-screen absolute ${'fade-in'}`}
        >
            <div
                ref={ref}
                className="flex flex-col w-2/3 h-11/12 bg-yellow-500 rounded-md postIt-shadow"
            >
                <div className="flex flex-row">
                    <span className="relative top-0 right-0 p-4">
                        <svg
                            className="h-4 w-4 fill-current text-grey hover:text-grey-darkest"
                            role="button"
                            onClick={() => {
                                handleClose()
                                handleSave()
                            }}
                        >
                            <title>Close</title>
                            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                        </svg>
                    </span>
                    <div className="flex flex-row w-full h-1/12 justify-center font-title text-5xl mr-10">
                        <div>{props.classe}</div>
                    </div>
                </div>

                <div className="flex h-64 justify-center">
                    <textarea
                        value={textInputValue}
                        onChange={(e) => setTextInputValue(e.target.value)}
                        className="flex w-10/12 h-64 z-30 bg-transparent text-lg align-text-top p-2"
                        placeholder={'Fais-toi une petite note'}
                    />
                </div>
                {!confirmErase && (
                    <button
                        className={`pb-3 `}
                        onClick={() => setConfirmErase(true)}
                    >
                        Effacer tout
                    </button>
                )}
                {confirmErase && (
                    <button
                        className={`pb-3 text-red-800 text-bold`}
                        onClick={() => {
                            handleErase()
                            setConfirmErase(false)
                        }}
                    >
                        Confirmer
                    </button>
                )}
            </div>
        </div>
    )
}
