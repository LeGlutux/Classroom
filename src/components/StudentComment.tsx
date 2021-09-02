import React, { useState } from 'react'
import Firebase from '../firebase'
import { useComment, useStudent } from '../hooks'
import check from '../images/check.png'
import pen from '../images/edit.png'

interface Props {
    currentUserId: string;
    currentStudentId: string;
}

export default (props: Props) => {

    const db = Firebase.firestore()
    const {comment, refreshComment} = useComment(props.currentUserId, props.currentStudentId)

    const [inputValue, setInputValue] = useState(comment)
    const [edit, setEdit] = useState(false)
    const wrap = comment?.length >> 20 ? true : false

    return (
        <div className='flex flex-row w-full'>
            <div
                className={`flew flex-row w-full ${edit ? 'hidden' : 'visible'}`}
            >
                <div className={`flex w-full justify-between ${wrap} ? 'flex-col' : 'flex-row'}`}>
                    <div className='flex flex-row text-sm font-student mx-1 font-bold'> Commentaire:</div>
                    <div className='flex w-full justify-start'>
                        <div className='text-sm w-auto font-student mx-1'>{comment}</div>
                    </div>

                    <button
                        onClick={() => setEdit(true)}>
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
                        db
                            .collection('users')
                            .doc(props.currentUserId)
                            .collection('eleves')
                            .doc(props.currentStudentId)
                            .update({ comment: inputValue })

                        setEdit(false)
                        refreshComment()
                        e.preventDefault()
                        e.stopPropagation()

                    }}
                    action="">
                    <input
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