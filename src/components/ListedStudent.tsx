import React, { useContext } from 'react'

interface ListedStudentProps {
    name: string
    surname: string
    classes: string
    id: string
}

export default (props: ListedStudentProps) => {

return(
    <div className='flex flex-row w-full h-8 border-b-2 border-gray-300'>
        <div>{props.surname.concat(' ').concat(props.name)}</div>
        <div>{props.classes}</div>
    </div>
)
}