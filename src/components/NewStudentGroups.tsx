import React, { useState } from 'react'

interface NewStudentGroupsProps {
    classe: string
    list: string[]
}

export default (props: NewStudentGroupsProps) => {
    const [check, setCheck] = useState(false)

    const handleCheck = () => {
        if (check) {
            const index = props.list.indexOf(props.classe)
            if (index !== -1) props.list.splice(index, 1)
            setCheck(false)
        } else {
            props.list.push(props.classe)
            setCheck(true)
        }
    }

    return (
        <button
            type="button"
            className={`list-class-chip${check ? ' is-on' : ''}`}
            onClick={handleCheck}
        >
            {props.classe}
        </button>
    )
}
