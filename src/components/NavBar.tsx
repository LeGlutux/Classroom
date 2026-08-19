import React from 'react'
import { Link } from 'react-router-dom'
import { IconHome, IconList, IconSettings } from './Icons'

interface NavBarProps {
    activeMenu: string
    onHomeClick: () => void
}

export default (props: NavBarProps) => {
    return (
        <nav className="tab-bar" aria-label="Navigation principale">
            <Link
                to="/create"
                className={`tab-item ${
                    props.activeMenu === 'addPage' ? 'is-active' : ''
                }`}
            >
                <IconSettings className="tab-icon" />
                <span>Réglages</span>
            </Link>
            <Link
                to="/"
                className={`tab-item ${
                    props.activeMenu === 'home' ? 'is-active' : ''
                }`}
                onClick={props.onHomeClick}
            >
                <IconHome className="tab-icon" />
                <span>Accueil</span>
            </Link>
            <Link
                to="/lists"
                className={`tab-item ${
                    props.activeMenu === 'list' ? 'is-active' : ''
                }`}
            >
                <IconList className="tab-icon" />
                <span>Listes</span>
            </Link>
        </nav>
    )
}
