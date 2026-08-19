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
        <div className="class-filter-bar">
            <div className="class-filter-bar-inner">
                {groups.map((group, index) => {
                    return (
                        <button
                            onClick={() => {
                                onFilter(group)
                                setDisplayedGroup(group)
                                closeMenu(false)
                            }}
                            className="class-filter-chip font-studentName"
                            key={index}
                        >
                            {replacer(group)}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
