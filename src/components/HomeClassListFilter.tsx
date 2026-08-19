import React from 'react'

interface HomeClassListFilterProps {
    groups: string[]
    onFilter: (group: string) => void
    setDisplayedGroup: React.Dispatch<React.SetStateAction<string>>
    closeMenu: (value: React.SetStateAction<boolean>) => void
    display: (group: string) => boolean
}

export default ({
    groups,
    onFilter,
    setDisplayedGroup,
    closeMenu,
    display,
}: HomeClassListFilterProps) => {
    const shouldCenter = groups.length < 6

    return (
        <div className="flex flex-col flex-1 min-h-0 overflow-y-auto px-4">
            <div className={`flex flex-col py-4 ${shouldCenter ? 'min-h-full justify-center' : ''}`}>
                {groups.map((group, index) => {
                    return (
                        <button
                            key={index}
                            onClick={() => {
                                onFilter(group)
                                setDisplayedGroup(group)
                                closeMenu(false)
                            }}
                            className="class-card"
                            type="button"
                        >
                            {group}
                            <span
                                className={`note-dot ${
                                    display(group) ? '' : 'invisible'
                                }`}
                            />
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
