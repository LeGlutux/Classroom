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
                    className={`student-note-btn ${
                        comment ? '' : 'is-empty'
                    }`}
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
                    <span className="h-6 w-6">
                        <svg
                            className="h-6 w-6 fill-current text-grey hover:text-grey-darkest"
                            role="button"
                            onClick={() => handleDeletion()}
                        >
                            <title>Close</title>
                            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                        </svg>
                    </span>
                    <input
                        ref={inputRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="w-10/12 mr-2 h-8 z-50 placeholder-gray-400 bg-transparent text-lg xl:text-center"
                        type="text"
                        placeholder="Ajouter une note"
                    />
                    <button className="w-2/12 mx-2" type="submit">
                        <img className="w-6 h-6" src={check} alt="" />
                    </button>
                </form>
            )}
        </div>
    )
}
