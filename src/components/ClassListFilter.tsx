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
    const replacer = (word: string) => {
        return word.replace(/ /g, ':')
    }
    return (
        <div className="flex overflow-x-scroll w-9/12 ml-2 pr-1 bg-tranparent justify-start">
            {groups.map((group, index) => {
                return (
                    <button
                        onClick={() => {
                            onFilter(group)
                            setDisplayedGroup(group)
                            closeMenu(false)
                        }}
                        className="flex font-studentName h-8 mb-2 mx-1 bg-white text-center rounded-lg px-3 items-center"
                        key={index}
                    >
                        {replacer(group)}
                    </button>
                )
            })}
        </div>
    )
}
