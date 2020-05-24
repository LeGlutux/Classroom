import React, { useState, ChangeEvent, useContext } from 'react'
import firebase from 'firebase'
import { useCross } from '../hooks'
import { AuthContext } from '../Auth'
import { LearnMoreLinks } from 'react-native/Libraries/NewAppScreen'

interface StudentStatsProps {
    id: string
}

export default (props: StudentStatsProps) => {
    const stud = { surname: 'leo', name: 'ben', classes: ['5', '6'] }
    // const db = firebase.firestore()
    // const { currentUser } = useContext(AuthContext)
    // if (currentUser === null) return <div />
    // const groups = useCross(currentUser.uid, props.id)

    return (
        <div className="flex flex-col my-4">
            <div className="w-full text-3xl text-center my-4">
                {stud.surname.concat(' ').concat(stud.name)}
            </div>
            <div>{props.id}</div>
            <div className="w-full text-2xl my-4">
                {stud.classes.join(', ')}
            </div>
            <div className="mx-6 flex flex-col my-4">
                <div className="w-full text-3xl">Croix</div>
            </div>
        </div>
    )
}
