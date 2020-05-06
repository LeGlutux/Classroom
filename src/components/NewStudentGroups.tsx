import React, { useState, ChangeEvent } from 'react'

interface NewStudentGroupsProps {
    classe: string
    list: string[]
    // setList: React.Dispatch<React.SetStateAction<string>>
}

export default (props: NewStudentGroupsProps) => {
    const [check, setCheck] = useState(false)

    const index = props.list.indexOf(props.classe)

    const handleCheck = (bool: boolean, array: string[]) => {
        if (bool) {
            props.list.splice(index, 1)
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
            <div className="font-studentName flex text-center items-center text-xl mx-2">
                {props.classe}
            </div>
        </div>
    )
}
