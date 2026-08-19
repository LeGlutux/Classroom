import React from 'react'
import firebase from 'firebase/app'

interface PeriodeFilterProps {
    periodes: Date[]
    currentUser: string
    refresh: () => Promise<void>
    runningPeriode?: number
}

export default ({
    periodes,
    currentUser,
    refresh,
    runningPeriode,
}: PeriodeFilterProps) => {
    const db = firebase.firestore()
    return (
        <div className="flex ml-2 w-full justify-center flex-wrap">
            {periodes.map((periode, index) => {
                return (
                    <button
                        type="button"
                        onClick={() => {
                            db.collection('users')
                                .doc(currentUser)
                                .update({ runningPeriode: index + 1 })
                            refresh()
                        }}
                        className={`chip ${
                            runningPeriode === index + 1 ? 'is-active' : ''
                        }`}
                        key={index}
                    >
                        P{index + 1}
                    </button>
                )
            })}
        </div>
    )
}
