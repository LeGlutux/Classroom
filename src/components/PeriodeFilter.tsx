import React, { useState, ChangeEvent } from 'react'
import firebase from 'firebase'

interface PeriodeFilterProps {
    periodes: Date[]
    currentUser: string
    refresh: () => Promise<void>
}

export default ({ periodes, currentUser, refresh }: PeriodeFilterProps) => {
    const db = firebase.firestore()
    return (
        <div className="flex ml-2">
            {periodes.map((periode, index) => {
                return (
                    <button
                        onClick={() => {
                            db.collection('users')
                                .doc(currentUser)
                                .update({ runningPeriode: index + 1 })
                            refresh()
                        }}
                        className="font-studentName h-8 mx-2 bg-white w-16 text-center rounded-sm rounded-full"
                        key={index}
                    >
                        P{index + 1}
                    </button>
                )
            })}
        </div>
    )
}
