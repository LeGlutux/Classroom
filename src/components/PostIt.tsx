import React, { useRef, useState } from 'react'
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
        <div className="modal-overlay fade-in">
            <div ref={ref} className="postit-card">
                <div className="flex flex-row items-center justify-between">
                    <button
                        className="header-icon-btn"
                        type="button"
                        onClick={() => {
                            handleClose()
                            handleSave()
                        }}
                        aria-label="Fermer"
                    >
                        <svg viewBox="0 0 20 20">
                            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                        </svg>
                    </button>
                    <div className="page-title" style={{ fontSize: '1.5rem' }}>
                        {props.classe}
                    </div>
                    <div style={{ width: '2.5rem' }} />
                </div>
                <textarea
                    value={textInputValue}
                    onChange={(e) => setTextInputValue(e.target.value)}
                    className="field-input"
                    style={{ minHeight: '14rem', padding: '0.5rem 0' }}
                    placeholder={'Fais-toi une petite note'}
                />
                {!confirmErase && (
                    <button className="btn-ghost" type="button" onClick={() => setConfirmErase(true)}>
                        Effacer tout
                    </button>
                )}
                {confirmErase && (
                    <button
                        className="btn-danger"
                        type="button"
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
