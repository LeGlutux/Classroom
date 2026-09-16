import React, { useContext, useEffect, useState } from 'react'
import firebase from 'firebase/app'
import { AuthContext } from '../Auth'
import Firebase from '../firebase'
import SettingsLayout from './SettingsLayout'
import {
    isPronoteLinked,
    normalizePronoteUrl,
    parsePronoteLink,
    PronoteLink,
} from '../pronote/link'
import {
    readPronotePassword,
    writePronotePassword,
} from '../pronote/session'

type PronoteLinkFormProps = {
    uid: string
    onSaved?: () => void
}

export const PronoteLinkForm = ({ uid, onSaved }: PronoteLinkFormProps) => {
    const [url, setUrl] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [linkedMeta, setLinkedMeta] = useState(false)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [toast, setToast] = useState('')

    useEffect(() => {
        if (!uid) return
        return Firebase.firestore()
            .collection('users')
            .doc(uid)
            .onSnapshot(
                (doc) => {
                    const data = doc.data()
                    const next = parsePronoteLink(
                        data ? data.pronoteLink : null
                    )
                    if (next) {
                        setUrl(next.url)
                        setUsername(next.username)
                        setLinkedMeta(true)
                        const sessionPassword = readPronotePassword(uid)
                        setPassword(sessionPassword || '')
                    } else {
                        setLinkedMeta(false)
                    }
                    setLoading(false)
                },
                () => setLoading(false)
            )
    }, [uid])

    useEffect(() => {
        if (!toast) return
        const id = window.setTimeout(() => setToast(''), 3200)
        return () => window.clearTimeout(id)
    }, [toast])

    const save = async () => {
        setError('')
        const next: PronoteLink = {
            url: normalizePronoteUrl(url),
            username: username.trim(),
            password,
            linkedAt: Date.now(),
        }
        if (!isPronoteLinked(next)) {
            setError('Indiquez l’URL Pronote, l’identifiant et le mot de passe.')
            return
        }
        setSaving(true)
        try {
            // Mot de passe seulement en session navigateur — pas Firestore.
            await Firebase.firestore()
                .collection('users')
                .doc(uid)
                .set(
                    {
                        pronoteLink: {
                            url: next.url,
                            username: next.username,
                            linkedAt: next.linkedAt,
                        },
                    },
                    { merge: true }
                )
            writePronotePassword(uid, next.password)
            setLinkedMeta(true)
            setToast('Compte Pronote lié')
            if (onSaved) onSaved()
        } catch (err) {
            setError('Impossible d’enregistrer la liaison Pronote.')
        } finally {
            setSaving(false)
        }
    }

    const unlink = async () => {
        setError('')
        setSaving(true)
        try {
            await Firebase.firestore()
                .collection('users')
                .doc(uid)
                .update({
                    pronoteLink: firebase.firestore.FieldValue.delete(),
                })
            writePronotePassword(uid, '')
            setUrl('')
            setUsername('')
            setPassword('')
            setLinkedMeta(false)
            setToast('Liaison Pronote retirée')
        } catch (err) {
            setError('Impossible de retirer la liaison.')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return <p className="settings-panel-note">Chargement…</p>
    }

    return (
        <div className="pronote-link-form">
            {toast ? <div className="settings-toast">{toast}</div> : null}
            <p className="settings-panel-note">
                Liez votre espace professeur Pronote pour envoyer l’appel depuis
                le plan de classe. Le mot de passe reste dans cette session
                navigateur (il n’est pas stocké sur le serveur).
            </p>
            {linkedMeta ? (
                <p className="pronote-link-status is-on">
                    Compte lié · {username}
                    {!password
                        ? ' — resaisissez le mot de passe pour cette session'
                        : ''}
                </p>
            ) : (
                <p className="pronote-link-status">Aucun compte lié</p>
            )}
            <label className="modal-field">
                <span className="modal-label">URL Pronote</span>
                <input
                    className="modal-input"
                    value={url}
                    onChange={(event) => setUrl(event.target.value)}
                    placeholder="https://etablissement.index-education.net/pronote"
                    autoComplete="url"
                />
            </label>
            <label className="modal-field">
                <span className="modal-label">Identifiant</span>
                <input
                    className="modal-input"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    autoComplete="username"
                />
            </label>
            <label className="modal-field">
                <span className="modal-label">Mot de passe</span>
                <input
                    className="modal-input"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                />
            </label>
            {error ? <div className="modal-error">{error}</div> : null}
            <button
                type="button"
                className="settings-btn"
                onClick={save}
                disabled={saving}
            >
                {linkedMeta ? 'Mettre à jour la liaison' : 'Lier le compte Pronote'}
            </button>
            {linkedMeta ? (
                <button
                    type="button"
                    className="settings-btn settings-btn-danger"
                    onClick={unlink}
                    disabled={saving}
                >
                    Retirer la liaison
                </button>
            ) : null}
        </div>
    )
}

export default () => {
    const { currentUser } = useContext(AuthContext)
    if (currentUser === null) return <div />
    return (
        <SettingsLayout title="Lier Pronote" backTo="/create">
            <div className="settings-panel">
                <PronoteLinkForm uid={currentUser.uid} />
            </div>
        </SettingsLayout>
    )
}
