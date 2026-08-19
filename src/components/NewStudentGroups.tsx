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
        <button
            type="button"
            className={`chip ${check ? 'is-active' : ''}`}
            onClick={() => handleCheck(check, props.list)}
        >
            {props.classe}
        </button>
    )
}
