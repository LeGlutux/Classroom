import React, { useContext, useEffect, useState } from 'react'
import firebase from 'firebase/app'
import { Link } from 'react-router-dom'
import { AuthContext } from '../Auth'
import SettingsLayout from './SettingsLayout'
import ConfirmModal from './ConfirmModal'
import { useIcons, useSmsConfig, useVersion } from '../hooks'
import {
    buildCrossSlots,
    formatDateTime,
    isAdminUser,
    isDeletedReportExpired,
} from '../functions'
import {
    DEFAULT_SMS_TEMPLATES,
    SmsTemplate,
} from '../sms'
import { saveSmsConfig } from '../database'
import SmsEditor from './SmsEditor'
import {
    IconChat,
    IconChevronRight,
    IconFlag,
    IconUsers,
} from './Icons'

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

const AdminMenu = () => {
    const { currentUser } = useContext(AuthContext)
    const { version } = useVersion()
    if (currentUser === null || !isAdminUser(currentUser)) return <div />

    return (
        <SettingsLayout title="Maintenance" backTo="/create">
            <div className="settings-group">
                <Link to="/create/admin/signalements" className="settings-row">
                    <span className="settings-row-icon">
                        <IconFlag />
                    </span>
                    <span className="settings-row-body">
                        <span className="settings-row-title">
                            Suggestions / signalements
                        </span>
                        <span className="settings-row-sub">
                            Problèmes et idées envoyés par les profs
                        </span>
                    </span>
                    <IconChevronRight className="settings-row-chevron" />
                </Link>
                <Link to="/create/admin/utilisateurs" className="settings-row">
                    <span className="settings-row-icon">
                        <IconUsers />
                    </span>
                    <span className="settings-row-body">
                        <span className="settings-row-title">
                            Utilisateurices
                        </span>
                        <span className="settings-row-sub">
                            Comptes et dernière connexion
                        </span>
                    </span>
                    <IconChevronRight className="settings-row-chevron" />
                </Link>
                <Link to="/create/admin/sms" className="settings-row">
                    <span className="settings-row-icon">
                        <IconChat />
                    </span>
                    <span className="settings-row-body">
                        <span className="settings-row-title">Modèles SMS</span>
                        <span className="settings-row-sub">
                            Modèles par défaut et activation de la fonction
                        </span>
                    </span>
                    <IconChevronRight className="settings-row-chevron" />
                </Link>
            </div>
            <p className="settings-panel-note">Version de l’app : {version}</p>
        </SettingsLayout>
    )
}

export const AdminReports = () => {
    const { currentUser } = useContext(AuthContext)
    const [reports, setReports] = useState<Report[]>([])
    const [loading, setLoading] = useState(true)
    const [pendingDelete, setPendingDelete] = useState<Report | null>(null)

    useEffect(() => {
        if (!isAdminUser(currentUser)) return
        let cancelled = false
        const load = async () => {
            setLoading(true)
            const propsSnap = await firebase.firestore().collection('props').get()
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
                        firebase
                            .firestore()
                            .collection('props')
                            .doc(id)
                            .delete()
                    )
                )
            }
            if (cancelled) return
            setReports(nextReports)
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
        <SettingsLayout title="Signalements" backTo="/create/admin">
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
                </React.Fragment>
            )}
        </SettingsLayout>
    )
}

export const AdminAccounts = () => {
    const { currentUser } = useContext(AuthContext)
    const [accounts, setAccounts] = useState<Account[]>([])
    const [query, setQuery] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!isAdminUser(currentUser)) return
        let cancelled = false
        const load = async () => {
            setLoading(true)
            const usersSnap = await firebase.firestore().collection('users').get()
            if (cancelled) return
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
        <SettingsLayout title="Utilisateurices" backTo="/create/admin">
            {loading ? (
                <p className="settings-panel-note">Chargement…</p>
            ) : (
                <React.Fragment>
                    <div className="settings-panel">
                        <p
                            className="settings-panel-note"
                            style={{ textAlign: 'left' }}
                        >
                            {accounts.length} compte
                            {accounts.length > 1 ? 's' : ''} · triés par
                            dernière connexion
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
                                    {account.userName
                                        ? account.userName + ' · '
                                        : ''}
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
                </React.Fragment>
            )}
        </SettingsLayout>
    )
}

export const AdminSms = () => {
    const { currentUser } = useContext(AuthContext)
    const uid = currentUser ? currentUser.uid : ''
    const {
        smsEnabled,
        defaultTemplates,
        loading: configLoading,
    } = useSmsConfig()
    const { icons, positiveIcons } = useIcons(uid)
    const slots = buildCrossSlots(icons, positiveIcons)
    const [templates, setTemplates] = useState<SmsTemplate[]>([])
    const [enabled, setEnabled] = useState(false)
    const [saving, setSaving] = useState(false)
    const [toggling, setToggling] = useState(false)
    const [toast, setToast] = useState('')
    const [confirmReset, setConfirmReset] = useState(false)
    const hydrated = React.useRef(false)

    useEffect(() => {
        if (configLoading || hydrated.current) return
        setTemplates(defaultTemplates)
        setEnabled(smsEnabled)
        hydrated.current = true
    }, [configLoading, smsEnabled, defaultTemplates])

    if (currentUser === null || !isAdminUser(currentUser)) return <div />

    const saveTemplates = async (next: SmsTemplate[]) => {
        setSaving(true)
        await saveSmsConfig({ defaultTemplates: next })
        setTemplates(next)
        setSaving(false)
        setToast('Modèles par défaut enregistrés')
        window.setTimeout(() => setToast(''), 2500)
    }

    const toggleEnabled = async () => {
        const next = !enabled
        setEnabled(next)
        setToggling(true)
        try {
            await saveSmsConfig({ smsEnabled: next })
            setToast(
                next
                    ? 'SMS activé pour tout le monde'
                    : 'SMS réservé à l’admin'
            )
            window.setTimeout(() => setToast(''), 2500)
        } catch (error) {
            setEnabled(!next)
            setToast('L’enregistrement a échoué')
            window.setTimeout(() => setToast(''), 2500)
        }
        setToggling(false)
    }

    const resetDefaults = () =>
        DEFAULT_SMS_TEMPLATES.map((template) => ({
            id: template.id,
            title: template.title,
            body: template.body,
        }))

    return (
        <SettingsLayout
            title="Modèles SMS"
            backTo="/create/admin"
            toast={toast}
        >
            <ConfirmModal
                confirm={confirmReset}
                setConfirm={setConfirmReset}
                confirmAction={() => saveTemplates(resetDefaults())}
                textBox="Revenir aux modèles de base ?"
                subTextBox="Les modèles par défaut proposés aux profs seront remplacés."
            />
            <div className="settings-panel">
                <button
                    type="button"
                    className="sms-switch"
                    disabled={toggling}
                    onClick={toggleEnabled}
                >
                    <span className="sms-switch-copy">
                        <span className="sms-switch-title">
                            SMS pour tout le monde
                        </span>
                        <span className="sms-switch-sub">
                            {enabled
                                ? 'Les profs peuvent swiper et envoyer un SMS. Toi tu peux toujours le faire.'
                                : 'Fonction bloquée pour les autres. Toi tu peux toujours tester.'}
                        </span>
                    </span>
                    <span
                        className={`sms-switch-track${
                            enabled ? ' is-on' : ''
                        }`}
                    >
                        <span className="sms-switch-knob" />
                    </span>
                </button>
            </div>
            <div className="settings-panel">
                <p className="settings-panel-note" style={{ textAlign: 'left' }}>
                    Ces modèles s’affichent chez les profs qui n’ont pas encore
                    personnalisé les leurs. Jetons : #prénom, #nom, #classe,
                    #date, nombre de croix.
                </p>
            </div>
            {configLoading ? (
                <p className="settings-panel-note">Chargement…</p>
            ) : (
                <SmsEditor
                    templates={templates}
                    setTemplates={setTemplates}
                    slots={slots}
                    saving={saving}
                    onSave={() => saveTemplates(templates)}
                    resetLabel="Revenir aux modèles de base"
                    onReset={() => setConfirmReset(true)}
                />
            )}
        </SettingsLayout>
    )
}

export default AdminMenu
