import React, { useContext } from 'react'
import NavBar from './NavBar'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../Auth'
import { useLists } from '../hooks'

export default () => {
    const { id } = useParams()
    const { currentUser } = useContext(AuthContext)
    if (currentUser === null) return <div />
    const lists = useLists(currentUser.uid)
    const list = [] as firebase.firestore.DocumentData[]
    lists.forEach((d) => {
        // tslint:disable-next-line: no-conditional-assignment
        if ((d.id = id)) {
            list.push(d)
        }
    })

    return (
        <div className="w-full h-screen flex flex-col">
            <div className="h-24">
                <NavBar />
            </div>
            <div>{list[0].name}</div>
            <div>
                <button onClick={() => console.log(list)}>Salut</button>
            </div>
        </div>
    )
}
