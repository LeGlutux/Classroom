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
    const longestGroupString = groups.sort((a, b) => {
        return b.length - a.length
    })[0]

    const longestGroupLength = longestGroupString.length

    return (
        <div className="flex flex-col ml-2 mr-6 justify-start overflow-y-scroll">
            {groups.map((group, index) => {
                return (
                    <button
                        onClick={() => {
                            onFilter(group)
                            setDisplayedGroup(group)
                            closeMenu(false)
                        }}
                        className={`flex font-studentName h-16 my-4 bg-gray-300 justify-center shadow-custom rounded-lg pt-1 self-center text-4xl ${
                            longestGroupLength > 4 ? 'w-56' : 'w-32'
                        }`}
                        key={index}
                    >
                        {group}
                    </button>
                )
            })}
        </div>
    )
}
