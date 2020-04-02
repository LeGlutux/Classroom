import React, { useState, ChangeEvent } from 'react'
import data from '../data'

interface GroupButtonProps {
    group: string
    
}

const sortedStudents = data.sort((x,y) => x.classe.localeCompare(y.classe))
const [students, setStudents] = useState(sortedStudents)
const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setStudents(sortedStudents.filter(x => x.classe.toLowerCase().includes(e.target.value.toLowerCase())))
}
export default (Props:GroupButtonProps) => {

    return (
        <div className="flex overflow-auto ml-2">
                <div></div>
            </div>
    )
}