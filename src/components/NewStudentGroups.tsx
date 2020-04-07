import React, { useState, ChangeEvent } from 'react'
import { Interface } from 'readline'

interface NewStudentGroupsProps {
    name: string
}

export default (props: NewStudentGroupsProps) => {
    return (
        <div>
            <button className="font-studentName hover:bg-gray-500 h-8 mx-2 bg-white border-black-900 my-2 w-16 text-center rounded-lg  border-gray-400 border-2">
                {props.name}
            </button>
        </div>
    )
}
