import React, { useState, ChangeEvent, Component, useEffect } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import DatePicker from 'react-datepicker'

interface DaterProps {
    title: string
}

export default (props: DaterProps) => {
    const [startDate, setStartDate] = useState(new Date())

    return (
        <div className="flex flex-row">
            <div className="mx-4">Début {props.title}</div>

            <div className="flex flex-col">
                <DatePicker
                    selected={startDate}
                    onChange={(date) => {
                        if (date !== null) {
                            setStartDate(date)
                        }
                    }}
                />
            </div>
        </div>
    )
}
