import React from 'react'

interface HomeClassListFilterProps {
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
}: HomeClassListFilterProps) => {
    return (
        <div className="flex flex-col ml-2 mr-6 justify-evenly">
            {groups.map((group, index) => {
                return (
                    <button
                        onClick={() => {
                            onFilter(group)
                            setDisplayedGroup(group)
                            closeMenu(false)
                        }}
                        className="flex font-studentName h-16 my-4 bg-gray-400 w-32 justify-center rounded-lg pt-1 self-center text-4xl"
                        key={index}
                    >
                        {group}
                    </button>
                )
            })}
        </div>
    )
}
