import React, { useState, ChangeEvent } from 'react'

interface ClassListFilterProps {
    groups: string[]
    onFilter: (group: string) => void
}

export default ({ groups, onFilter }: ClassListFilterProps) => {
    return (
        <div className="flex overflow-auto ml-2">
            {groups.map((group, index) => {
                return (
                    <button
                        onClick={() => onFilter(group)}
                        className={`font-studentName hover:bg-gray-500 h-8 mx-2 bg-white border-black-900 my-2 w-16 text-center rounded-lg`}
                        key={index}
                    >
                        {group}
                    </button>
                )
            })}
        </div>
    )
}
