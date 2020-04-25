import React, { useState, ChangeEvent } from 'react'

interface NewStudentGroupsProps {
    classe: string
    // list: string[]
    // setList: React.Dispatch<React.SetStateAction<string>>
}

export default (props: NewStudentGroupsProps) => {
    return (
        <div className="flex flex-row">
            <input type="checkbox" className={`h-8 w-8 my-2`} />
            <div className="font-studentName flex text-center items-center text-xl mx-2">
                {props.classe}
            </div>
        </div>
    )
}
