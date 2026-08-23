import React from 'react'
import { PostItAlert } from './PostIt'

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
            <div
                className={`flex flex-col py-2 home-class-list ${
                    shouldCenter ? 'min-h-full justify-center' : ''
                }`}
            >
                {groups.map((group, index) => {
                    return (
                        <div
                            className="flex flex-row justify-center items-center w-auto my-4"
                            key={index}
                        >
                            <div
                                className={`home-class-card-wrap ${
                                    longestGroupLength > 4 ? 'w-56' : 'w-32'
                                }`}
                            >
                                <button
                                    onClick={() => {
                                        onFilter(group)
                                        setDisplayedGroup(group)
                                        closeMenu(false)
                                    }}
                                    className="home-class-card flex font-studentName h-16 w-full"
                                >
                                    {group}
                                </button>
                                {display(group) ? <PostItAlert /> : null}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
