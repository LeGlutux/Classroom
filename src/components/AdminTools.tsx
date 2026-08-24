import React, { useContext, useEffect, useState } from 'react'
import firebase from 'firebase/app'
import { AuthContext } from '../Auth'
import SettingsLayout from './SettingsLayout'
import {
    formatDateTime,
    isAdminUser,
    isDeletedReportExpired,
} from '../functions'
import ConfirmModal from './ConfirmModal'
import { useVersion } from '../hooks'

type FeedbackType = 'problem' | 'suggestion'
type FeedbackStatus = 'pending' | 'seen' | 'resolved'

const normalizeType = (value: any): FeedbackType =>
    value === 'suggestion' ? 'suggestion' : 'problem'

const normalizeStatus = (value: any): FeedbackStatus => {
    if (value === 'seen' || value === 'resolved') return value
    return 'pending'
}

type Report = {
    id: string
    message: string
    email: string
    uid: string
    userName: string
    createdAt: any
    deletedAt: any
    userAgent: string
    type: FeedbackType
    status: FeedbackStatus
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
    const [pendingDelete, setPendingDelete] = useState<Report | null>(null)

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
            const expiredIds: string[] = []
            const nextReports: Report[] = []
            propsSnap.docs.forEach((doc) => {
                const data = doc.data()
                if (data.kind !== 'report') return
                if (isDeletedReportExpired(data.deletedAt)) {
                    expiredIds.push(doc.id)
                    return
                }
                if (data.deletedAt) return
                nextReports.push({
                    id: doc.id,
                    message: data.message || '',
                    email: data.email || '',
                    uid: data.uid || '',
                    userName: data.userName || '',
                    createdAt: data.createdAt,
                    deletedAt: data.deletedAt || null,
                    userAgent: data.userAgent || '',
                    type: normalizeType(data.type),
                    status: normalizeStatus(data.status),
                })
            })
            nextReports.sort((a, b) => {
                const timeA =
                    a.createdAt && a.createdAt.toMillis
                        ? a.createdAt.toMillis()
                        : 0
                const timeB =
                    b.createdAt && b.createdAt.toMillis
                        ? b.createdAt.toMillis()
                        : 0
                return timeB - timeA
            })
            if (expiredIds.length) {
                await Promise.all(
                    expiredIds.map((id) =>
                        db.collection('props').doc(id).delete()
                    )
                )
            }
            if (cancelled) return
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

    const setReportStatus = async (id: string, status: FeedbackStatus) => {
        await firebase
            .firestore()
            .collection('props')
            .doc(id)
            .update({ status })
        setReports((previous) =>
            previous.map((report) =>
                report.id === id ? { ...report, status } : report
            )
        )
    }

    const deleteReport = async (report: Report) => {
        await firebase
            .firestore()
            .collection('props')
            .doc(report.id)
            .update({
                status: 'resolved',
                deletedAt: firebase.firestore.FieldValue.serverTimestamp(),
            })
        setReports((previous) =>
            previous.filter((item) => item.id !== report.id)
        )
        setPendingDelete(null)
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

    const renderFeedbackList = (title: string, type: FeedbackType) => {
        const list = reports.filter((report) => report.type === type)
        return (
            <React.Fragment>
                <div className="settings-group-label">{title}</div>
                {list.length === 0 ? (
                    <p className="settings-panel-note">Aucun pour le moment.</p>
                ) : (
                    list.map((report) => (
                        <div
                            key={report.id}
                            className={`report-card is-${report.type}`}
                        >
                            <div className="report-card-top">
                                <div className="report-meta">
                                    {report.userName
                                        ? report.userName + ' · '
                                        : ''}
                                    {report.email || report.uid}
                                </div>
                                <span
                                    className={`report-status is-${report.status}`}
                                >
                                    {report.status === 'seen'
                                        ? 'Vu'
                                        : report.status === 'resolved'
                                        ? 'Réglé'
                                        : 'En attente'}
                                </span>
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
                            <div className="report-actions">
                                <button
                                    type="button"
                                    className={`report-resolve ${
                                        report.status === 'seen' ? 'is-on' : ''
                                    }`}
                                    onClick={() =>
                                        setReportStatus(report.id, 'seen')
                                    }
                                >
                                    Vu
                                </button>
                                <button
                                    type="button"
                                    className={`report-resolve ${
                                        report.status === 'resolved'
                                            ? 'is-on'
                                            : ''
                                    }`}
                                    onClick={() =>
                                        setReportStatus(report.id, 'resolved')
                                    }
                                >
                                    Réglé
                                </button>
                                <button
                                    type="button"
                                    className="report-resolve report-delete"
                                    onClick={() => setPendingDelete(report)}
                                >
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </React.Fragment>
        )
    }

    return (
        <SettingsLayout title="Maintenance" backTo="/create">
            <ConfirmModal
                confirm={pendingDelete !== null}
                setConfirm={(value) => {
                    const next =
                        typeof value === 'function'
                            ? value(pendingDelete !== null)
                            : value
                    if (!next) setPendingDelete(null)
                }}
                confirmAction={() => {
                    if (pendingDelete) deleteReport(pendingDelete)
                }}
                danger
                textBox="Supprimer ce signalement ?"
                subTextBox="La personne le verra comme réglé. Il disparaîtra de son côté au bout d’un mois."
            />
            {loading ? (
                <p className="settings-panel-note">Chargement…</p>
            ) : (
                <React.Fragment>
                    {renderFeedbackList('Problèmes', 'problem')}
                    {renderFeedbackList('Suggestions', 'suggestion')}

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
