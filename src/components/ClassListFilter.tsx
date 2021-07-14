import React from 'react'

interface ClassListFilterProps {
    groups: string[]
    onFilter: (group: string) => void
    setDisplayedGroup: React.Dispatch<React.SetStateAction<string>>
    closeMenu: (value: React.SetStateAction<boolean>) => void
}

export default ({
    groups,
    onFilter,
    setDisplayedGroup,
    closeMenu,
}: ClassListFilterProps) => {
    return (
        <div className="flex overflow-auto ml-2 mr-6">
            {groups.map((group, index) => {
                return (
                    <button
                        onClick={() => {
                            onFilter(group)
                            setDisplayedGroup(group)
                            closeMenu(false)
                        }}
                        className="font-studentName h-8 mb-2 mx-1 bg-gray-100 w-auto text-center rounded-lg px-3 flex items-center"
                        key={index}
                    >
                        {group}
                    </button>
                )
            })}
        </div>
    )
}
