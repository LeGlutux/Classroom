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
                        className="font-studentName h-8 mx-2 bg-white w-16 text-center rounded-sm rounded-full"
                        key={index}
                    >
                        {group}
                    </button>
                )
            })}
        </div>
    )
}
