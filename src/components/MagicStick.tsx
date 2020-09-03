import React from 'react'
import LightStudent from './LightStudent'

interface MagicStickProps {
    students: firebase.firestore.DocumentData[]
    displayRandomStudent: boolean
    setDisplayRandomStudent: React.Dispatch<React.SetStateAction<boolean>>
}

export default (props: MagicStickProps) => {
    const randNumber = Math.floor(Math.random() * props.students.length)
    // const selectedStudent = props.students[randNumber]

    return (
        <div
            className={`flex flex-col z-50 fixed w-full h-full items-center justify-center self-center ${
                props.displayRandomStudent ? 'visible' : 'invisible'
            }`}
            style={{ backgroundColor: 'rgba(255,255,255,0.6)' }}
        >
            <div className="flex flex-col border-black bg-white shadow-lg justify-center items-center w-3/4 h-82 relative">
                <span className="absolute top-0 right-0 p-4">
                    <svg
                        className="h-4 w-4 fill-current text-grey hover:text-grey-darkest"
                        role="button"
                        onClick={() => props.setDisplayRandomStudent(false)}
                    >
                        <title>Close</title>
                        <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                    </svg>
                </span>
                <div className="w-3/4 h-full flex justify-between sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-center font-bold">
                    {props.students.map(({ name, surname, classes, id }, i) => {
                        if (i === randNumber)
                            return (
                                <LightStudent
                                    key={i + 1}
                                    classes={classes}
                                    name={name}
                                    surname={surname}
                                    id={id}
                                />
                            )
                        else {
                            return <div />
                        }
                    })}
                </div>

                <div className="flex flex-row w-full justify-around mt-4">
                    <button
                        className="bg-green-500 mb-8 rounded-lg font-bold w-24 h-12 lg:w-32 lg:h-12 xl:w-40 xl:h-16 shadow-xl font-studentName sm:text-lg md:text-xl lg:text-2xl xl:text-3xl"
                        onClick={() => {
                            props.setDisplayRandomStudent(false)
                        }}
                    >
                        OK !
                    </button>
                </div>
            </div>
        </div>
    )
}
