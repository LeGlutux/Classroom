import React from 'react'
import { Link } from 'react-router-dom'

interface NavBarProps {
    activeMenu: string
    onHomeClick: () => void
}

const IconHome = () => (
    <svg viewBox="0 0 24 24" className="tab-icon" aria-hidden="true">
        <path d="M4.5 10.5 12 4l7.5 6.5V20a1.5 1.5 0 0 1-1.5 1.5h-4.25v-6h-4.5v6H6A1.5 1.5 0 0 1 4.5 20z" />
    </svg>
)

const IconLists = () => (
    <svg viewBox="0 0 24 24" className="tab-icon" aria-hidden="true">
        <path d="M7 6.75h12.5v1.8H7zm0 4.85h12.5v1.8H7zm0 4.85h12.5v1.8H7zM4.4 6.5a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3zm0 4.85a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3zm0 4.85a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3z" />
    </svg>
)

const IconSettings = () => (
    <svg viewBox="0 0 24 24" className="tab-icon" aria-hidden="true">
        <path d="M12 8.25A3.75 3.75 0 1 1 8.25 12 3.75 3.75 0 0 1 12 8.25zm8.1 2.4-.95-.16a6.9 6.9 0 0 0-.66-1.58l.55-.8a.9.9 0 0 0-.1-1.12l-1.48-1.48a.9.9 0 0 0-1.12-.1l-.8.55a6.9 6.9 0 0 0-1.58-.66L13.8 3.9a.9.9 0 0 0-.9-.65h-2.1a.9.9 0 0 0-.9.65l-.16.95a6.9 6.9 0 0 0-1.58.66l-.8-.55a.9.9 0 0 0-1.12.1L4.76 6.54a.9.9 0 0 0-.1 1.12l.55.8a6.9 6.9 0 0 0-.66 1.58l-.95.16a.9.9 0 0 0-.75.89v2.1a.9.9 0 0 0 .75.89l.95.16c.16.56.38 1.09.66 1.58l-.55.8a.9.9 0 0 0 .1 1.12l1.48 1.48a.9.9 0 0 0 1.12.1l.8-.55c.49.28 1.02.5 1.58.66l.16.95a.9.9 0 0 0 .9.65h2.1a.9.9 0 0 0 .9-.65l.16-.95a6.9 6.9 0 0 0 1.58-.66l.8.55a.9.9 0 0 0 1.12-.1l1.48-1.48a.9.9 0 0 0 .1-1.12l-.55-.8c.28-.49.5-1.02.66-1.58l.95-.16a.9.9 0 0 0 .75-.89v-2.1a.9.9 0 0 0-.75-.89z" />
    </svg>
)

export default (props: NavBarProps) => {
    return (
        <nav className="tab-bar" aria-label="Navigation principale">
            <Link
                to="/create"
                className={`tab-item ${
                    props.activeMenu === 'addPage' ? 'is-active' : ''
                }`}
            >
                <IconSettings />
                <span>Réglages</span>
            </Link>
            <Link
                to="/"
                className={`tab-item ${
                    props.activeMenu === 'home' ? 'is-active' : ''
                }`}
                onClick={props.onHomeClick}
            >
                <IconHome />
                <span>Accueil</span>
            </Link>
            <Link
                to="/lists"
                className={`tab-item ${
                    props.activeMenu === 'list' ? 'is-active' : ''
                }`}
            >
                <IconLists />
                <span>Listes</span>
            </Link>
        </nav>
    )
}
