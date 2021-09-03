import React, { useRef, useState } from 'react'
import Firebase from '../firebase'
import useOnClickOutside, { useComment, useStudent } from '../hooks'
import check from '../images/check.png'
import pen from '../images/edit.png'

interface Props {
    currentUserId: string;
    currentStudentId: string;
}

export default (props: Props) => {

    const db = Firebase.firestore()
    const { comment, refreshComment } = useComment(props.currentUserId, props.currentStudentId)

    const inputRef = useRef<HTMLInputElement>(null)
    const cardRef = useRef<HTMLDivElement>(null)

    const [inputValue, setInputValue] = useState(comment)
    const [edit, setEdit] = useState(false)
    const wrap = comment !== undefined && comment.length >= 20 ? true : false

    const handleEdition = () => {
        setEdit(true)
        setInputValue(comment)
        setTimeout(() => inputRef.current!.focus(), 100)
    }

    const handleValidation = () => {
        db
            .collection('users')
            .doc(props.currentUserId)
            .collection('eleves')
            .doc(props.currentStudentId)
            .update({ comment: inputValue })

        setEdit(false)
        refreshComment()
    }


    useOnClickOutside(cardRef, handleValidation)

    return (
        <div
            ref={cardRef}
            className='flex flex-row w-full'>
            <div
                className={`flew flex-row w-full ml-2 ${edit ? 'hidden' : 'visible'}`}
            >
                <div className={`flex w-11/12 justify-between`}>
                    <div className='flex flex-col text-sm font-student mx-1 font-bold'> Commentaire:
                        {wrap &&
                            <div className='flex w-full justify-start'>
                                <div className='text-sm w-auto font-student font-normal'>{comment}</div>
                            </div>}
                    </div>
                    {!wrap &&
                        <div className='flex w-full justify-start'>
                            <div className='text-sm w-auto font-student font-normal'>{comment}</div>
                        </div>}


                    <button
                        onClick={() => handleEdition()}>
                        <img className="h-4 w-6 mr-2" src={pen} alt="" />
                    </button>
                </div>
            </div>
            <div
                className={`${edit ? 'visible' : 'hidden'}`}
            >
                <form
                    className={`flex flex-row`}
                    onSubmit={(e) => {
                        handleValidation()
                        e.preventDefault()
                        e.stopPropagation()

                    }}
                    action="">
                    <input
                        ref={inputRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="w-10/12 mx-2 mb-2 h-8 z-50 placeholder-gray-700 ml-5 bg-transparent border-b-2 border-gray-600 text-lg xl:text-center"
                        type="text"
                        placeholder={comment}
                    />
                    <button
                        className='w-2/12 mx-2'
                        type='submit'>
                        <img
                            className='w-6 h-6'
                            src={check} alt="" />
                    </button>
                </form>
            </div>
        </div>
    )
}