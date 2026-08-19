import React, { useEffect, useRef, useState } from 'react'
import Firebase from '../firebase'
import useOnClickOutside from '../hooks'
import check from '../images/check.png'
import pen from '../images/edit.png'

interface Props {
    currentUserId: string
    currentStudentId: string
    comment: string
}

export default (props: Props) => {
    const db = Firebase.firestore()
    const [comment, setComment] = useState(props.comment)

    useEffect(() => {
        setComment(props.comment)
    }, [props.comment])

    const inputRef = useRef<HTMLInputElement>(null)
    const cardRef = useRef<HTMLDivElement>(null)

    const [inputValue, setInputValue] = useState(props.comment)
    const [edit, setEdit] = useState(false)

    const handleEdition = () => {
        setEdit(true)
        setInputValue(comment)
        setTimeout(() => inputRef.current!.focus(), 100)
    }

    const handleValidation = () => {
        if (edit === true) {
            const commentCased = inputValue.replace(/^\w/, (c) =>
                c.toUpperCase()
            )

            db.collection('users')
                .doc(props.currentUserId)
                .collection('eleves')
                .doc(props.currentStudentId)
                .update({ comment: commentCased })

            setEdit(false)
            setComment(commentCased)
        }
    }

    const handleDeletion = () => {
        db.collection('users')
            .doc(props.currentUserId)
            .collection('eleves')
            .doc(props.currentStudentId)
            .update({ comment: '' })

        setEdit(false)
        setComment('')
    }

    useOnClickOutside(cardRef, handleValidation)

    return (
        <div ref={cardRef} className="student-note">
            {!edit && (
                <button
                    type="button"
                    className="student-note-btn"
                    onClick={() => handleEdition()}
                >
                    <img src={pen} alt="" />
                    <span>{comment || 'Ajouter une note'}</span>
                </button>
            )}
            {edit && (
                <form
                    className="student-note-form"
                    onSubmit={(e) => {
                        handleValidation()
                        e.preventDefault()
                        e.stopPropagation()
                    }}
                    action=""
                >
                    <button
                        type="button"
                        className="header-icon-btn"
                        onClick={() => handleDeletion()}
                        aria-label="Effacer la note"
                    >
                        <svg viewBox="0 0 20 20">
                            <title>Close</title>
                            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                        </svg>
                    </button>
                    <input
                        ref={inputRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="field-input"
                        type="text"
                        placeholder={comment || 'Note'}
                    />
                    <button className="header-icon-btn" type="submit">
                        <img src={check} alt="Valider" />
                    </button>
                </form>
            )}
        </div>
    )
}
