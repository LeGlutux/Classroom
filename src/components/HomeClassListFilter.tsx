import React from 'react'
import stickyNoteRed from '../images/stickyNoteRed2.png'

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
    const longestGroupString = groups.sort((a, b) => {
        return b.length - a.length
    })[0]

    const longestGroupLength = longestGroupString.length

    return (
        <div className="flex flex-col ml-2 mr-6 justify-start overflow-y-scroll">
            {groups.map((group, index) => {
                return (
                    <div
                        className="flex flex-row justify-center items-center w-auto"
                        key={index}
                    >
                        <button
                            onClick={() => {
                                onFilter(group)
                                setDisplayedGroup(group)
                                closeMenu(false)
                            }}
                            className={`flex relative font-studentName h-16 my-4 bg-gray-300 justify-center shadow-custom rounded-lg pt-1 self-center text-4xl ${
                                longestGroupLength > 4 ? 'w-56' : 'w-32'
                            }`}
                        >
                            {group}
                            <div
                                className={`flex justify-center items-center badge h-10 w-10 rounded-full ${
                                    display(group) ? 'visible' : 'invisible'
                                }`}
                            >
                                <img
                                    className="h-10 w-10"
                                    src={stickyNoteRed}
                                    alt=""
                                />
                            </div>
                        </button>
                    </div>
                )
            })}
        </div>
    )
}
