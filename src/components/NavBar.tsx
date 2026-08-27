import React from 'react'
import { Link } from 'react-router-dom'
import addPage from '../images/addPage.png'
import list from '../images/list.png'
import home from '../images/home.png'

interface NavBarProps {
    activeMenu: string
    onHomeClick: () => void
}

const navIconClass = (active: boolean) =>
    `self-center${active ? '' : ' nav-icon-inactive'}`

export default (props: NavBarProps) => {
    return (
        <div className="flex flex-row px-4 h-full justify-around py-2">
            <div
                className="rounded-full h-8 w-8 xl:h-10 xl:w-10 flex justify-center"
                data-tutorial-spot="nav-settings"
            >
                <Link to="/create">
                    <img
                        className={navIconClass(props.activeMenu === 'addPage')}
                        src={addPage}
                        alt=""
                    />
                </Link>
            </div>
            <div
                className={`rounded-full h-8 w-8 xl:h-10 xl:w-10 flex justify-center`}
                onClick={props.onHomeClick}
            >
                <Link to="/">
                    <img
                        className={navIconClass(props.activeMenu === 'home')}
                        src={home}
                        alt=""
                    />
                </Link>
            </div>
            <div className="rounded-full h-8 w-8 xl:h-10 xl:w-10 flex justify-center">
                <Link to="/lists">
                    <img
                        className={navIconClass(props.activeMenu === 'list')}
                        src={list}
                        alt=""
                    />
                </Link>
            </div>
        </div>
    )
}
