import React from 'react'
import firebase from 'firebase/app'
import { useLists } from '../hooks'
import { AuthContext } from '../Auth'


interface CrossTabProps {
    studentId: string
    userId: string
    week: number
    index: number
}

export default (props: CrossTabProps) => {
    const { currentUser } = useContext(AuthContext)
    if (currentUser === null) return <div />
    const lists = useLists(currentUser.uid)

}