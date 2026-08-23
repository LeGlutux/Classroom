import React, { useRef, useState } from 'react'
import Firebase from '../firebase'

interface PostItProps {
    currentUserId: string
    classe: string
    content: string
    currentClasse: string
    setDisplay: React.Dispatch<React.SetStateAction<boolean>>
    postIts: { classe: string; content: string }[]
    onSave: (postIts: { classe: string; content: string }[]) => void
    index: number
}

export const PostItAlert = (props: { onClick?: () => void }) => {
    const dot = <span className="postit-alert-dot" aria-hidden="true" />
    if (props.onClick) {
        return (
            <button
                type="button"
                className="postit-alert is-clickable"
                aria-label="Ouvrir le pense-bête"
                onClick={props.onClick}
            >
                {dot}
            </button>
        )
    }
    return (
        <span className="postit-alert" aria-label="Pense-bête">
            {dot}
        </span>
    )
}

export default (props: PostItProps) => {
    const db = Firebase.firestore()
    const [confirmErase, setConfirmErase] = useState(false)
    const [textInputValue, setTextInputValue] = useState(props.content)
    const textRef = useRef(textInputValue)
    textRef.current = textInputValue

    const handleErase = () => {
        setTextInputValue('')
    }

    const handleClose = () => {
        if (props.classe !== 'tous') {
            const content = textRef.current
            const newPostIts = props.postIts.slice()
            newPostIts[props.index] = {
                classe: props.classe,
                content,
            }
            props.onSave(newPostIts)
            db.collection('users')
                .doc(props.currentUserId)
                .update({ postIt: newPostIts })
        }
        props.setDisplay(false)
    }

    return (
        <div className="modal-overlay postit-overlay" onClick={handleClose}>
            <div
                className="postit-card"
                onClick={(event) => event.stopPropagation()}
            >
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
