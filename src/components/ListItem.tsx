import React, { useState } from 'react'

interface Props {
    n: number
}

export default (props: Props) => {
    const [itemInputValue, setItemInputValue] = useState('')
    const text = 'item '.concat((props.n + 1).toString())
    return (
        <div className="w-9/12 flex flex-col hover:border-gray-800">
            <input
                value={itemInputValue}
                onChange={(e) => setItemInputValue(e.target.value)}
                className="h-10 mt-3 placeholder-graborder-gray-800 ml-5 bg-transparent border-b-2 border-gray-800 text-lg xl:text-center"
                type="text"
                placeholder={text}
            />
        </div>
    )
}
