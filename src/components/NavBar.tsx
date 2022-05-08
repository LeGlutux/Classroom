import React from 'react'
import { Link } from 'react-router-dom'
import addPage from '../images/addPage.png'
import onAddPage from '../images/onAddPage.png'

import list from '../images/list.png'
import onList from '../images/onList.png'

import home from '../images/home.png'
import onHome from '../images/onHome.png'


interface NavBarProps {
activeMenu: string
}

export default (props: NavBarProps) => {
    return (
        <div className="flex flex-row bg-gray-300 border-5 border-orange-300 px-4 h-full justify-around py-2">
            <div className="rounded-full h-8 w-8 xl:h-10 xl:w-10 flex justify-center">
                <Link to="/create">
                    <img className="self-center" src={props.activeMenu==="addPage" ? onAddPage : addPage } alt="" />
                </Link>
            </div>
            <div
                className={`rounded-full h-8 w-8 xl:h-10 xl:w-10 flex justify-center`}
            >
                <Link to="/">
                    <img className="self-center" src={props.activeMenu==="home" ? onHome : home} alt="" />
                </Link>
            </div>
            <div className="rounded-full h-8 w-8 xl:h-10 xl:w-10 flex justify-center">
                <Link to="/lists">
                    <img className="self-center" src={props.activeMenu==="list" ? onList : list} alt="" />
                </Link>
            </div>
        </div>
    )
}
