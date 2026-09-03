import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import addPage from '../images/addPage.png'
import list from '../images/list.png'
import home from '../images/home.png'
import { AuthContext } from '../Auth'
import { isAdminUser } from '../functions'
import { usePendingReportCount } from '../hooks'
import { IconGrid } from './Icons'
import { NoticeBadge } from './NoticeBadge'

interface NavBarProps {
    activeMenu: string
    onHomeClick: () => void
}

const navIconClass = (active: boolean) =>
    `self-center${active ? '' : ' nav-icon-inactive'}`

export default (props: NavBarProps) => {
    const { currentUser } = useContext(AuthContext)
    const pendingReports = usePendingReportCount(isAdminUser(currentUser))

    return (
        <div className="flex flex-row px-4 h-full justify-around py-2">
            <div className="rounded-full h-8 w-8 xl:h-10 xl:w-10 flex justify-center relative">
                <Link
                    to="/create"
                    className="nav-badge-wrap"
                    aria-label={
                        pendingReports
                            ? `Paramètres, ${pendingReports} nouveau${
                                  pendingReports > 1 ? 'x' : ''
                              } signalement${pendingReports > 1 ? 's' : ''}`
                            : 'Paramètres'
                    }
                >
                    <img
                        className={navIconClass(props.activeMenu === 'addPage')}
                        src={addPage}
                        alt=""
                    />
                    <NoticeBadge count={pendingReports} />
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
            <div className="rounded-full h-8 w-8 xl:h-10 xl:w-10 flex justify-center items-center">
                <Link to="/plan" aria-label="Plan de classe">
                    <IconGrid
                        className={`tn-icon nav-plan-icon${
                            props.activeMenu === 'plan'
                                ? ''
                                : ' nav-icon-inactive'
                        }`}
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
