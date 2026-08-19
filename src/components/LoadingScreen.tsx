import React from 'react'
import loader_image from '../images/loader.gif'
import PageShell from './PageShell'

interface LoadingScreenProps {
    title?: string
    message?: string
    activeMenu?: string
    onHomeClick?: () => void
    standalone?: boolean
}

export default (props: LoadingScreenProps) => {
    const body = (
        <div className="empty-state">
            <img className="loader-mascot" src={loader_image} alt="" />
            <p className="empty-state-title">
                {props.message || 'Chargement des données'}
            </p>
        </div>
    )

    if (props.standalone) {
        return <div className="app-shell">{body}</div>
    }

    return (
        <PageShell
            title={props.title || 'Thòt Note'}
            activeMenu={props.activeMenu || 'home'}
            onHomeClick={props.onHomeClick || (() => undefined)}
            flush
        >
            {body}
        </PageShell>
    )
}
