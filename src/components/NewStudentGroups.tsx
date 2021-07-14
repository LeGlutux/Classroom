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
        <div className="flex flex-row">
            <input
                type="checkbox"
                className={`h-4 w-4 my-2`}
                checked={check}
                onChange={(e) => handleCheck(check, props.list)}
            />
            <div className="font-studentName flex text-center items-center text-lg mx-2">
                {props.classe}
            </div>
        </div>
    )
}
