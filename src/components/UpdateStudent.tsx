import React from 'react'

interface UpdateStudentProps {
    croix: React.Dispatch<React.SetStateAction<number>>
}

export default (croix: UpdateStudentProps) => {
    return (
        <div>
            <div>
                <button onClick={() => 0}>-</button>
                <img src="" alt="" />
                <button onClick={() => 0}>+</button>
            </div>
        </div>
    )
}
