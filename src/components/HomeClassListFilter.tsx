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
    const shouldCenter = groups.length < 6

    return (
        <div className="flex flex-col ml-2 mr-6 flex-1 min-h-0 overflow-y-auto px-2">
            <div className={`flex flex-col py-2 home-class-list ${shouldCenter ? 'min-h-full justify-center' : ''}`}>
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
                                className={`home-class-card flex relative font-studentName h-16 my-4 self-center ${
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
        </div>
    )
}
