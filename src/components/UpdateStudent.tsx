import React from 'react'

interface UpdateStudentProps {
    img: string
    croix: number
    setCroix: React.Dispatch<React.SetStateAction<number>>
}

export default ({ img, croix, setCroix }: UpdateStudentProps) => {
    return (
        <div>
            <div>
                <button
                    onClick={() => {
                        if (croix >= 1) {
                            setCroix(croix - 1)
                        }
                    }}
                    className="text-6xl"
                >
                    -
                </button>
                <img src={img} alt="" />
                <button
                    onClick={() => {
                        setCroix(croix + 1)
                    }}
                    className="text-6xl"
                >
                    +
                </button>
            </div>
        </div>
    )
}
