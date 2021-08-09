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
        <div className="flex flex-col w-full xl:w-1/3 items-center justify-around h-40">
            <div className={`rounded mt-5 pb-1 mx-2 bg-white w-full h-full`}>
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

                </div>
            </div>
        </div>
    )
}
