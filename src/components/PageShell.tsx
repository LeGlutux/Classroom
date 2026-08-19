import React from 'react'
import NavBar from './NavBar'

interface PageShellProps {
    title: React.ReactNode
    activeMenu: string
    onHomeClick: () => void
    children: React.ReactNode
    leading?: React.ReactNode
    trailing?: React.ReactNode
    subtitle?: React.ReactNode
    showNav?: boolean
    flush?: boolean
}

export default (props: PageShellProps) => {
    const showNav = props.showNav !== false
    return (
        <div className="app-shell">
            <header className="page-header">
                <div className="page-header-side">{props.leading}</div>
                <div className="page-header-main">
                    <h1 className="page-title">{props.title}</h1>
                    {props.subtitle && (
                        <div className="page-subtitle">{props.subtitle}</div>
                    )}
                </div>
                <div className="page-header-side page-header-side-right">
                    {props.trailing}
                </div>
            </header>
            <main
                className={
                    props.flush ? 'page-body page-body-flush' : 'page-body'
                }
            >
                {props.children}
            </main>
            {showNav && (
                <NavBar
                    activeMenu={props.activeMenu}
                    onHomeClick={props.onHomeClick}
                />
            )}
        </div>
    )
}
