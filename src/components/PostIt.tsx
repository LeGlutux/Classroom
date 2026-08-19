import React, { useRef, useState } from 'react'
import Firebase from '../firebase'
import useOnClickOutside from '../hooks'
import { IconNote } from './Icons'

interface PostItProps {
    currentUserId: string
    classe: string
    content: string
    currentClasse: string
    setDisplay: React.Dispatch<React.SetStateAction<boolean>>
    postIts: { classe: string; content: string }[]
    index: number
}

export const PostItAlert = () => (
    <span className="postit-alert" aria-label="Pense-bête">
        <IconNote />
    </span>
)

export default (props: PostItProps) => {
    const db = Firebase.firestore()
    const [confirmErase, setConfirmErase] = useState(false)
    const [textInputValue, setTextInputValue] = useState(props.content)

    const handleErase = () => {
        setTextInputValue('')
    }

    const handleSave = () => {
        if (props.classe !== 'tous') {
            const newPostIts = props.postIts.slice()
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
        handleSave()
        props.setDisplay(false)
    }

    const ref = useRef(null)
    useOnClickOutside(ref, handleClose)

    return (
        <div className="modal-overlay postit-overlay">
            <div ref={ref} className="postit-card">
                <div className="postit-title">{props.classe}</div>
                <textarea
                    value={textInputValue}
                    onChange={(e) => setTextInputValue(e.target.value)}
                    className="postit-input"
                    placeholder="Fais-toi une petite note"
                />
                <div className="postit-actions">
                    {!confirmErase ? (
                        <button
                            type="button"
                            className="postit-erase"
                            onClick={() => setConfirmErase(true)}
                        >
                            Effacer
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="postit-erase is-confirm"
                            onClick={() => {
                                handleErase()
                                setConfirmErase(false)
                            }}
                        >
                            Confirmer
                        </button>
                    )}
                    <button
                        type="button"
                        className="postit-ok"
                        onClick={handleClose}
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    )
}
