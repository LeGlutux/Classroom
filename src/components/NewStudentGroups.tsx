import React, { useState } from 'react'

interface NewStudentGroupsProps {
    classe: string
    list: string[]
}

export default (props: NewStudentGroupsProps) => {
    const [check, setCheck] = useState(false)

    const handleCheck = (bool: boolean, array: string[]) => {
        if (bool) {
            props.list.splice(props.list.indexOf(props.classe), 1)
            setCheck(!bool)
        } else {
            props.list.push(props.classe)
            setCheck(!bool)
        }
    }
    return (
        <div className="flex flex-row items-center cursor-pointer">
            <input
                type="checkbox"
                className={`h-5 w-5 mr-2 cursor-pointer accent-orange-500`}
                checked={check}
                onChange={(e) => handleCheck(check, props.list)}
            />
            <div className={`font-studentName flex text-center items-center text-base transition-colors ${
                check ? 'text-orange-600 font-semibold' : 'text-gray-700'
            }`}>
                {props.classe}
            </div>
        </div>
    )
}
