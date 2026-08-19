import React from 'react'
import { Link } from 'react-router-dom'
import NavBar from './NavBar'
import { IconChevronLeft } from './Icons'

interface SettingsLayoutProps {
    title: string
    backTo?: string
    children: React.ReactNode
    toast?: string
}

export default ({ title, backTo, children, toast }: SettingsLayoutProps) => {
    const handleHomeClick = () => {
        localStorage.removeItem('displayedGroup')
    }

    return (
        <div className="w-full h-screen flex flex-col overflow-hidden app-bg">
            <div className="flex-shrink-0 relative flex flex-row w-full h-12 page-header items-center justify-center">
                {backTo && (
                    <Link to={backTo} className="settings-back" aria-label="Retour">
                        <IconChevronLeft />
                    </Link>
                )}
                <span className="page-header-title">{title}</span>
            </div>
            <div className="flex-1 min-h-0 overflow-y-scroll settings-body">
                {children}
            </div>
            {toast ? <div className="settings-toast">{toast}</div> : null}
            <div className="flex-shrink-0 w-full h-12 nav-wrap">
                <NavBar activeMenu="addPage" onHomeClick={handleHomeClick} />
            </div>
        </div>
    )
}
