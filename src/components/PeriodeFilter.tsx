import React from 'react'
import firebase from 'firebase/app'

interface PeriodeFilterProps {
    periodes: Date[]
    currentUser: string
    refresh: () => Promise<void>
}

export default ({ periodes, currentUser, refresh }: PeriodeFilterProps) => {
    const db = firebase.firestore()
    return (
        <div className="flex ml-2 w-full justify-center flex-wrap">
            {periodes.map((periode, index) => {
                return (
                    <button
                        onClick={() => {
                            db.collection('users')
                                .doc(currentUser)
                                .update({ runningPeriode: index + 1 })
                            refresh()
                        }}
                        className="chip"
                        key={index}
                    >
                        P{index + 1}
                    </button>
                )
            })}
        </div>
    )
}
