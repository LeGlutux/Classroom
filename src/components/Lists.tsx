import React, { useContext, useState } from 'react'
import { useLists } from '../hooks'
import { AuthContext } from '../Auth'
import NavBar from './NavBar'
import add from '../images/add.png'
import { Link } from 'react-router-dom'
import ListPreview from './ListPreview'

export default () => {
    const { currentUser } = useContext(AuthContext)
    if (currentUser === null) return <div />
    const [listsRefresher, setListsRefresher] = useState(0)
    const lists = useLists(currentUser.uid, listsRefresher)
    return (
        <div className="h-screen w-full flex flex-col">
            <div className="flex flex-row w-full h-12 border-b-2 border-gray-400 items-center">
                <Link className="flex flex-row mx-6 w-full h-6" to="/createlist">
                    <img className="h-6 w-6" src={add} alt="" />
                    <div className="font-studentName mx-4">
                        Créer une nouvelle liste
                    </div>
                </Link>
            </div>
            <div className="flex flex-col w-full">
                {lists.map(({ name, group, id, date, itemN }, index) => {
                    return (
                        <ListPreview
                            key={id.concat(Math.random())}
                            id={id}
                            name={name}
                            classes={group}
                            itemsN={itemN}
                            date={date}
                            refresher={setListsRefresher}
                        />
                    )
                })}
            </div>
            <div className='h-screen'></div>
            <div className={`w-full h-12 bg-gray-300 table-footer-group hello`}>
                <NavBar />
            </div>
        </div>
    )
}
