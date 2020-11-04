import React, { useContext, useState, useStudents } from 'react'
import firebase from 'firebase/app'
import { useLists } from '../hooks'
import { AuthContext } from '../Auth'

interface ListsProps {
   
}

export default (props: ListsProps) => {
    const { currentUser } = useContext(AuthContext)
    if (currentUser === null) return <div />
    const lists = useLists(currentUser.uid)
    const db = firebase.firestore()
    const students = useStudents(currentUser.uid)

}