import React from 'react'

interface ClassListFilterProps {
    groups: string[]
    onFilter: (group: string) => void
}

export default ({ groups, onFilter }: ClassListFilterProps) => {
    return (
        <div className="flex overflow-auto ml-2 mr-6">
            {groups.map((group, index) => {
                return (
                    <button
                        onClick={() => onFilter(group)}
                        className="font-studentName h-8 mb-2 mx-2 bg-gray-100 w-auto text-center rounded-lg px-3 flex items-center"
                        key={index}
                    >
                        {group}
                    </button>
                )
            })}
        </div>
    )
}
