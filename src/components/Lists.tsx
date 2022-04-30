import React, { useContext, useState } from 'react'
import { useLists } from '../hooks'
import { AuthContext } from '../Auth'
import NavBar from './NavBar'
import add from '../images/add.png'
import { Link } from 'react-router-dom'
import ListPreview from './ListPreview'
import loader_image from '../images/loader.gif'

export default () => {
    const { currentUser } = useContext(AuthContext)
    if (currentUser === null) return <div />
    const [listsRefresher, setListsRefresher] = useState(0)
    const { lists, loading } = useLists(currentUser.uid, listsRefresher)

    if (loading) {
        return (
            <div className="w-full h-screen flex flex-col justify-center items-center">
                <div className="flex flex-row w-full h-12 border-b-2 border-gray-400 items-center font-title font-bold justify-center text-4xl rounded-b-full xl:text-6xl xl:h-16">
                    Mes listes
                </div>
                <div className="h-full flex flex-col justify-center items-center">
                    <div className="font-title text-4xl mb-8 text-bold">
                        Chargement des données
                    </div>
                    <div className="w-48 h-48 mt-8">
                        <img src={loader_image} alt="" />
                    </div>
                </div>

                <div className={`w-full h-12 bg-gray-300 sticky bottom-0`}>
                    <NavBar />
                </div>
            </div>
        )
    }

    if (lists.length === 0) {
        return (
            <div className="w-full h-screen flex flex-col justify-center items-center">
                <div className="flex flex-row w-full h-12 border-b-2 border-gray-400 items-center font-title font-bold justify-center text-4xl rounded-b-full xl:text-6xl xl:h-16">
                    Mes listes
                </div>
                <div className="h-full flex flex-col justify-center items-center">
                    <div className="flex w-11/12 text-center font-title text-4xl mb-8 text-bold">
                        C'est ici pour créer des listes
                    </div>
                    <div className="flex w-11/12 justify-center font-title text-3xl mb-8 text-bold">
                        Pour essayer, ça se passe ici :
                    </div>
                    <div className="font-title text-4xl mb-8 text-bold">
                        <Link
                            className="flex flex-col w-20 h-20 bg-gray-200 rounded-full shadow-custom items-center justify-center p-2"
                            to="/createlist"
                        >
                            <img src={add} alt="" />
                        </Link>
                    </div>
                </div>

                <div className={`w-full h-12 bg-gray-300 sticky bottom-0`}>
                    <NavBar />
                </div>
            </div>
        )
    }

    return (
        <div className="h-screen w-full flex flex-col">
            <div className="flex flex-row w-full h-12 border-b-2 border-gray-400 items-center font-title font-bold justify-center text-4xl rounded-b-full xl:text-6xl xl:h-16">
                Mes listes
            </div>
            <div className="flex flex-col w-full mt-8 border-t-2">
                {lists.map(({ name, group, id, date, itemN }, index) => {
                    return (
                        <ListPreview
                            currentUserId={currentUser.uid}
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
            <div className="h-screen" />
            <Link
                className="flex flex-col w-16 h-16 bg-gray-200 rounded-full bottom-right-custom2 shadow-custom items-center justify-center"
                to="/createlist"
            >
                <img className="h-6 w-6" src={add} alt="" />
            </Link>
            <div className={`w-full h-12 bg-gray-300 sticky bottom-0`}>
                <NavBar />
            </div>
        </div>
    )
}
