import React, { useState, ChangeEvent } from 'react'
import Student from './components/Student'
import data from './data'


export default () => {

   
    return (
        <div className="flex w-full h-screen flex-col p-2">
            <div className="w-full h-12 bg-gray-400 flex flex-row justify-between">
                <div className="ml-3 my-2 font-bold text-xl flex justify-around">Groupes</div>
                <div className="flex overflow-auto ml-2">
                <div><button className="h-8 mx-2 bg-white border-black-900 my-2 w-16 text-center rounded-lg">5ème3</button></div>
                <div><button className="h-8 mx-2 bg-white border-black-900 my-2 w-16 text-center rounded-lg">5ème5</button></div>
                <div><button className="h-8 mx-2 bg-white border-black-900 my-2 w-16 text-center rounded-lg">3ème3</button></div>
                <div><button className="h-8 mx-2 bg-white border-black-900 my-2 w-16 text-center rounded-lg">3ème5</button></div>
                </div>
            </div>
            {data.map(({ name, surname, avatar, classe }) => {
                return (
                    <Student
                        classe={classe}
                        name={name}
                        avatar={avatar}
                        surname={surname}
                    />
                )
            })}
        </div>
    )
}
