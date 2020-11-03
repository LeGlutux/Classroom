import React, { useState } from 'react'

interface Props {
    n: number
    items: string[]
    setItems: React.Dispatch<React.SetStateAction<string[]>>
}

export default (props: Props) => {
    const [itemInputValue, setItemInputValue] = useState('')
    const text = 'item '.concat((props.n + 1).toString())
    return (
        <div className="w-9/12 flex flex-col hover:border-gray-800">
            <input
                value={props.items[props.n+1]}
                onChange={(e) => {
                    props.items.splice(0, 1, e.target.value)
                    props.setItems(props.items)
                }}
                className="h-10 mt-3 placeholder-graborder-gray-800 ml-5 bg-transparent border-b-2 border-gray-800 text-lg xl:text-center"
                type="text"
                placeholder={text}
            />
        </div>
    )
}
