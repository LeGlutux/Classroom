import React, { useState, ChangeEvent } from 'react'

interface NewStudentGroupsProps {
    classe: string
}

export default (props: NewStudentGroupsProps) => {
    return (
        <div>
            <button
                // onClick={() => (props.isActive = !props.isActive)}
                className={`font-studentName hover:bg-gray-500 h-8 mx-2 border-black-900 my-2 w-16 text-center rounded-lg  border-gray-400 border-2 `}
            >
                {props.classe}
            </button>
        </div>
    )
}
