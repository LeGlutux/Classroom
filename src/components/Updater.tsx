import React, { useContext, useState } from 'react'
import { AuthContext } from '../Auth'
import { useGroups, useStudents, useUpdated } from '../hooks'
import Firebase from '../firebase'

export default () => {
    const db = Firebase.firestore()
    const { currentUser } = useContext(AuthContext)
    if (currentUser === null) return <div />
    const { students } = useStudents(currentUser.uid)
    const { groups } = useGroups(currentUser.uid)
    const update = () => {
        const list = [] as {
            classe: string
            listing: firebase.firestore.DocumentData[]
        }[]
        const emptyList = [] as {
            classe: string
            listing: firebase.firestore.DocumentData[]
        }[]
        const empty = [] as firebase.firestore.DocumentData[]
        groups.forEach((classe) => {
            const groupList = students.filter(
                (s) => classe.toString() === s.classes[0]
            )
            list.push({ classe, listing: groupList })
            emptyList.push({ classe, listing: empty })
        })

        db.collection('users').doc(currentUser.uid).update({
            notYetSelectedStudents: list,
            selectedStudents: emptyList,
            updated: true,
        })
    }
    return (
        <button
            onClick={() => {
                update()
            }}
        >
            Appuyer ici pour continuer puis recharger la page
        </button>
    )
}
