import React, { useState, ChangeEvent, useContext } from 'react'

interface StudentStatsProps {
    name: string
    surname: string
    classes: string
    id: string
}

export default (props: StudentStatsProps) => {
    return <div>{props.surname.concat(' ').concat(props.name)}</div>
}
