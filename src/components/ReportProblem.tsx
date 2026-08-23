import React, { useContext, useEffect, useState } from 'react'
import firebase from 'firebase/app'
import { AuthContext } from '../Auth'
import SettingsLayout from './SettingsLayout'
import { useUser } from '../hooks'
import { formatDateTime } from '../functions'

type FeedbackType = 'problem' | 'suggestion'
type FeedbackStatus = 'pending' | 'seen' | 'resolved'

type Feedback = {
    id: string
    message: string
    type: FeedbackType
    status: FeedbackStatus
    hiddenByUser: boolean
    createdAt: any
}

const statusLabel = (status: FeedbackStatus) => {
    if (status === 'seen') return 'Vu'
    if (status === 'resolved') return 'Réglé'
    return 'En attente'
}

const normalizeType = (value: any): FeedbackType =>
    value === 'suggestion' ? 'suggestion' : 'problem'

const normalizeStatus = (value: any): FeedbackStatus => {
    if (value === 'seen' || value === 'resolved') return value
    return 'pending'
}

export default () => {
    const { currentUser } = useContext(AuthContext)
    const uid = currentUser ? currentUser.uid : ''
    const { user } = useUser(uid)
    const [feedbackType, setFeedbackType] = useState<FeedbackType>('problem')
    const [message, setMessage] = useState('')
    const [sending, setSending] = useState(false)
    const [sent, setSent] = useState(false)
    const [mine, setMine] = useState<Feedback[]>([])
    const [loadingMine, setLoadingMine] = useState(true)

    const loadMine = async () => {
        if (!currentUser) return
        const snap = await firebase
            .firestore()
            .collection('props')
            .get()
        const next = snap.docs
            .map((doc) => {
                const data = doc.data()
                return {
                    id: doc.id,
                    message: data.message || '',
                    type: normalizeType(data.type),
                    status: normalizeStatus(data.status),
                    hiddenByUser: !!data.hiddenByUser,
                    createdAt: data.createdAt,
                    uid: data.uid || '',
                    kind: data.kind,
                }
            })
            .filter(
                (doc) =>
                    doc.kind === 'report' &&
                    doc.uid === currentUser.uid &&
                    !doc.hiddenByUser
            )
            .sort((a, b) => {
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
        setMine(next)
        setLoadingMine(false)
    }

    useEffect(() => {
        loadMine()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uid])

    if (currentUser === null) return <div />

    const handleSend = async () => {
        const text = message.trim()
        if (!text) {
            alert('Écrivez un court message.')
            return
        }
        setSending(true)
        try {
            await firebase
                .firestore()
                .collection('props')
                .add({
                    kind: 'report',
                    type: feedbackType,
                    status: 'pending',
                    hiddenByUser: false,
                    message: text,
                    email: currentUser.email || '',
                    uid: currentUser.uid,
                    userName: (user && user.userName) || '',
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    userAgent:
                        typeof navigator !== 'undefined'
                            ? navigator.userAgent
                            : '',
                })
            setMessage('')
            setSent(true)
            setTimeout(() => setSent(false), 3500)
            await loadMine()
        } catch (error) {
            alert("L'envoi a échoué. Réessayez dans un instant.")
        }
        setSending(false)
    }

    const markMineResolved = async (id: string) => {
        await firebase
            .firestore()
            .collection('props')
            .doc(id)
            .update({
                hiddenByUser: true,
                status: 'resolved',
            })
        setMine((previous) => previous.filter((item) => item.id !== id))
    }

    return (
        <SettingsLayout
            title="Signaler un problème, faire une suggestion"
            backTo="/create"
            toast={sent ? 'Merci, le message a bien été envoyé.' : undefined}
        >
            <div className="settings-panel">
                <p className="settings-panel-note" style={{ textAlign: 'left' }}>
                    Choisissez le type, puis décrivez. Le message arrive chez
                    Léo, avec votre email de compte.
                </p>
                <div className="report-type-toggle">
                    <button
                        type="button"
                        className={`report-type-btn is-problem ${
                            feedbackType === 'problem' ? 'is-on' : ''
                        }`}
                        onClick={() => setFeedbackType('problem')}
                    >
                        Problème
                    </button>
                    <button
                        type="button"
                        className={`report-type-btn is-suggestion ${
                            feedbackType === 'suggestion' ? 'is-on' : ''
                        }`}
                        onClick={() => setFeedbackType('suggestion')}
                    >
                        Suggestion
                    </button>
                </div>
                <label className="modal-field">
                    <span className="modal-label">Message</span>
                    <textarea
                        className="modal-textarea"
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                        placeholder={
                            feedbackType === 'suggestion'
                                ? 'Ex. Un export PDF des croix serait utile…'
                                : 'Ex. Les croix ne s’enregistrent plus sur la classe 6A…'
                        }
                    />
                </label>
                <button
                    type="button"
                    className={`settings-btn ${
                        sending || !message.trim() ? 'is-disabled' : ''
                    }`}
                    onClick={handleSend}
                >
                    Envoyer
                </button>
            </div>

            <div className="settings-group-label">Mes envois</div>
            {loadingMine ? (
                <p className="settings-panel-note">Chargement…</p>
            ) : mine.length === 0 ? (
                <p className="settings-panel-note">
                    Aucun message pour le moment.
                </p>
            ) : (
                mine.map((item) => (
                    <div
                        key={item.id}
                        className={`report-card is-${item.type}`}
                    >
                        <div className="report-card-top">
                            <span
                                className={`report-kind is-${item.type}`}
                            >
                                {item.type === 'suggestion'
                                    ? 'Suggestion'
                                    : 'Problème'}
                            </span>
                            <span
                                className={`report-status is-${item.status}`}
                            >
                                {statusLabel(item.status)}
                            </span>
                        </div>
                        <div className="report-date">
                            {formatDateTime(item.createdAt)}
                        </div>
                        <div className="report-message">{item.message}</div>
                        <label className="report-check">
                            <input
                                type="checkbox"
                                onChange={() => markMineResolved(item.id)}
                            />
                            Réglé
                        </label>
                    </div>
                ))
            )}
        </SettingsLayout>
    )
}
