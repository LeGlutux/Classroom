import React, { useContext, useState } from 'react'
import { useLists } from '../hooks'
import { AuthContext } from '../Auth'
import { Link } from 'react-router-dom'
import ListPreview from './ListPreview'
import PageShell from './PageShell'
import LoadingScreen from './LoadingScreen'
import { IconPlus } from './Icons'

export default () => {
    const handleHomeClick = () => {
        localStorage.removeItem('displayedGroup')
    }
    const { currentUser } = useContext(AuthContext)
    if (currentUser === null) return <div />
    const [listsRefresher, setListsRefresher] = useState(0)
    const { lists, loading } = useLists(currentUser.uid, listsRefresher)

    if (loading) {
        return (
            <LoadingScreen
                title="Mes listes"
                activeMenu="list"
                onHomeClick={handleHomeClick}
            />
        )
    }

    if (lists.length === 0) {
        return (
            <PageShell
                title="Mes listes"
                activeMenu="list"
                onHomeClick={handleHomeClick}
                flush
            >
                <div className="empty-state">
                    <p className="empty-state-title">Créer une liste</p>
                    <p className="empty-state-text">
                        Suivez les devoirs, le matériel ou la participation
                        classe par classe.
                    </p>
                    <Link className="btn-primary" to="/createlist">
                        Nouvelle liste
                    </Link>
                </div>
            </PageShell>
        )
    }

    return (
        <PageShell
            title="Mes listes"
            activeMenu="list"
            onHomeClick={handleHomeClick}
        >
            {lists.map(({ name, group, id, date, itemN }) => {
                return (
                    <ListPreview
                        currentUserId={currentUser.uid}
                        key={id.concat(String(itemN))}
                        id={id}
                        name={name}
                        classes={group}
                        itemsN={itemN}
                        date={date}
                        refresher={setListsRefresher}
                    />
                )
            })}
            <Link className="fab-btn bottom-right-custom2" to="/createlist" aria-label="Créer une liste">
                <IconPlus />
            </Link>
        </PageShell>
    )
}
