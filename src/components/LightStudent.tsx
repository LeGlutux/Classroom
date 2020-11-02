import React, { useContext } from 'react'
import { AuthContext } from '../Auth'

interface StudentProps {
    name: string
    surname: string
    classes: string
    id: string
}

export default (props: StudentProps) => {
    const { currentUser } = useContext(AuthContext)
    if (currentUser === null) return <div />

    return (
        <div className="flex flex-col w-full xl:w-1/3 items-center justify-between h-full">
            <div className="rounded mt-5 pb-1 mx-2 bg-gray-100 w-full h-fulls">
                <div className="flex justify-around flex-col h-full">
                    <div
                        className={`font-studentName ml-2 text-gray-900 font-medium xl:text-4xl h-8 pt-3
                                ${
                                    props.surname.length + props.name.length >
                                    20
                                        ? 'text-xl'
                                        : 'text-3xl'
                                }`}
                    >
                        {props.surname}
                    </div>
                    <div
                        className={`font-studentName ml-2 text-gray-900 xl:text-4xl font-bold h-8 p-3
                                ${
                                    props.surname.length + props.name.length >
                                    20
                                        ? 'text-xl'
                                        : 'text-3xl'
                                }`}
                    >
                        {props.name}
                    </div>
                    <div
                        className={`font-light ml-2 text-gray-900 xl:text-4xl h-8 p-3
                                ${
                                    props.classes.length > 20
                                        ? 'text-lg'
                                        : 'text-xl'
                                }`}
                    >
                        {props.classes}
                    </div>
                </div>
            </div>
        </div>
    )
}
