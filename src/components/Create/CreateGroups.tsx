import React, { useState, ChangeEvent } from 'react'
import add from '../../images/add.png'
import group from '../../images/group.png'

export default () => {
    const [groups, setGroups] = useState([{ name: 'Tous' }])
    const [inputValue, setInputValue] = useState('')

    return (
        <div className="w-full flex flex-col items-center">
            <div className="w-6/12 bg-purple-800 h-8 rounded-t-full mt-6 font-studentName text-white text-center pt-1">
                GROUPES
            </div>
            <div className="w-11/12 flex flex-row align-middle justify-between content-center rounded-lg h-32 bg-white">
                <img
                    className="h-20 w-20 flex self-center ml-2"
                    src={group}
                    alt=""
                />
                <form
                    className="flex flex-row w-3/4"
                    action=""
                    onSubmit={(e) => {
                        if (inputValue !== '') {
                            setGroups(groups.concat({ name: inputValue }))
                            setInputValue('')
                        }
                        e.preventDefault()
                        e.stopPropagation()
                    }}
                >
                    <input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="w-3/4 h-10 my-2 rounded bg-gray-100 py-2 px-3 text-gray-900 border-gray-600 border-2 rounded-full self-center"
                        type="text"
                        placeholder="Nom du groupe"
                    />
                    <input
                        type="image"
                        className="flex h-16 w-16 self-center"
                        src={add}
                    />
                </form>
            </div>
        </div>
    )
}
