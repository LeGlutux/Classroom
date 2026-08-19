import React, { useContext, useEffect, useState } from 'react'
import firebase from 'firebase/app'
import { AuthContext } from '../Auth'
import SettingsLayout from './SettingsLayout'
import { formatDateTime, isAdminUser } from '../functions'
import { useVersion } from '../hooks'

type Report = {
    id: string
    message: string
    email: string
    uid: string
    userName: string
    createdAt: any
    userAgent: string
}

type Account = {
    id: string
    email: string
    userName: string
    lastConnection: any
    classes: string[]
}

export default () => {
    const { currentUser } = useContext(AuthContext)
    const { version } = useVersion()
    const [reports, setReports] = useState<Report[]>([])
    const [accounts, setAccounts] = useState<Account[]>([])
    const [query, setQuery] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!isAdminUser(currentUser)) return
        let cancelled = false
        const load = async () => {
            setLoading(true)
            const db = firebase.firestore()
            const [propsSnap, usersSnap] = await Promise.all([
                db.collection('props').get(),
                db.collection('users').get(),
            ])
            if (cancelled) return
            const nextReports = propsSnap.docs
                .map((doc) => {
                    const data = doc.data()
                    return {
                        id: doc.id,
                        message: data.message || '',
                        email: data.email || '',
                        uid: data.uid || '',
                        userName: data.userName || '',
                        createdAt: data.createdAt,
                        userAgent: data.userAgent || '',
                        kind: data.kind,
                    }
                })
                .filter((doc) => doc.kind === 'report')
                .sort((a, b) => {
                    const timeA = a.createdAt && a.createdAt.toMillis
                        ? a.createdAt.toMillis()
                        : 0
                    const timeB = b.createdAt && b.createdAt.toMillis
                        ? b.createdAt.toMillis()
                        : 0
                    return timeB - timeA
                })
            setReports(nextReports)
            const nextAccounts = usersSnap.docs
                .map((doc) => {
                    const data = doc.data()
                    return {
                        id: doc.id,
                        email: data.email || '',
                        userName: data.userName || '',
                        lastConnection: data.lastConnection,
                        classes: Array.isArray(data.classes) ? data.classes : [],
                    } as Account
                })
                .sort((a, b) => {
                    const timeA =
                        a.lastConnection && a.lastConnection.toMillis
                            ? a.lastConnection.toMillis()
                            : 0
                    const timeB =
                        b.lastConnection && b.lastConnection.toMillis
                            ? b.lastConnection.toMillis()
                            : 0
                    return timeB - timeA
                })
            setAccounts(nextAccounts)
            setLoading(false)
        }
        load()
        return () => {
            cancelled = true
        }
    }, [currentUser])

    if (currentUser === null || !isAdminUser(currentUser)) return <div />

    const resolveReport = async (id: string) => {
        await firebase
            .firestore()
            .collection('props')
            .doc(id)
            .delete()
        setReports((previous) => previous.filter((report) => report.id !== id))
    }

    const filteredAccounts = accounts.filter((account) => {
        const haystack = (
            account.email +
            ' ' +
            account.userName +
            ' ' +
            account.classes.join(' ')
        ).toLowerCase()
        return haystack.indexOf(query.trim().toLowerCase()) !== -1
    })

    return (
        <SettingsLayout title="Maintenance" backTo="/create">
            {loading ? (
                <p className="settings-panel-note">Chargement…</p>
            ) : (
                <React.Fragment>
                    <div className="settings-group-label">Signalements</div>
                    {reports.length === 0 ? (
                        <p className="settings-panel-note">
                            Aucun problème en attente.
                        </p>
                    ) : (
                        reports.map((report) => (
                            <div key={report.id} className="report-card">
                                <div className="report-meta">
                                    {report.userName ? report.userName + ' · ' : ''}
                                    {report.email || report.uid}
                                </div>
                                <div className="report-date">
                                    {formatDateTime(report.createdAt)}
                                </div>
                                <div className="report-message">
                                    {report.message}
                                </div>
                                {report.userAgent ? (
                                    <div className="report-agent">
                                        {report.userAgent}
                                    </div>
                                ) : null}
                                <button
                                    type="button"
                                    className="report-resolve"
                                    onClick={() => resolveReport(report.id)}
                                >
                                    Réglé
                                </button>
                            </div>
                        ))
                    )}

                    <div className="settings-group-label">Comptes</div>
                    <div className="settings-panel">
                        <p className="settings-panel-note" style={{ textAlign: 'left' }}>
                            {accounts.length} compte
                            {accounts.length > 1 ? 's' : ''} · triés par dernière
                            connexion
                        </p>
                        <input
                            className="modal-input"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Rechercher un email, un prénom, une classe…"
                        />
                    </div>
                    {filteredAccounts.map((account) => (
                        <div key={account.id} className="account-row">
                            <div className="account-main">
                                <div className="account-email">
                                    {account.email || account.id}
                                </div>
                                <div className="account-sub">
                                    {account.userName ? account.userName + ' · ' : ''}
                                    {account.classes.length} classe
                                    {account.classes.length > 1 ? 's' : ''}
                                    {account.classes.length
                                        ? ' · ' + account.classes.join(', ')
                                        : ''}
                                </div>
                            </div>
                            <div className="account-seen">
                                {formatDateTime(account.lastConnection)}
                            </div>
                        </div>
                    ))}

                    <p className="settings-panel-note">
                        Version de l’app : {version}
                    </p>
                </React.Fragment>
            )}
        </SettingsLayout>
    )
}
