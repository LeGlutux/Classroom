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
        <div className="flex overflow-x-scroll w-full pr-1 justify-start">
            {groups.map((group, index) => {
                return (
                    <button
                        onClick={() => {
                            onFilter(group)
                            setDisplayedGroup(group)
                            closeMenu(false)
                        }}
                        className="chip"
                        key={index}
                        type="button"
                    >
                        {replacer(group)}
                    </button>
                )
            })}
        </div>
    )
}
