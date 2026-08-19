import React, { useContext, useState } from 'react'
import firebase from 'firebase/app'
import { AuthContext } from '../Auth'
import SettingsLayout from './SettingsLayout'
import { useUser } from '../hooks'

export default () => {
    const { currentUser } = useContext(AuthContext)
    const uid = currentUser ? currentUser.uid : ''
    const { user } = useUser(uid)
    const [message, setMessage] = useState('')
    const [sending, setSending] = useState(false)
    const [sent, setSent] = useState(false)

    if (currentUser === null) return <div />

    const handleSend = async () => {
        const text = message.trim()
        if (!text) {
            alert('Écrivez un court message pour décrire le problème.')
            return
        }
        setSending(true)
        try {
            await firebase
                .firestore()
                .collection('props')
                .add({
                    kind: 'report',
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
        } catch (error) {
            alert("L'envoi a échoué. Réessayez dans un instant.")
        }
        setSending(false)
    }

    return (
        <SettingsLayout
            title="Signaler un problème"
            backTo="/create"
            toast={sent ? 'Merci, le message a bien été envoyé.' : undefined}
        >
            <div className="settings-panel">
                <p className="settings-panel-note" style={{ textAlign: 'left' }}>
                    Décrivez ce qui ne va pas. Le message arrive directement
                    chez Léo, avec votre email de compte.
                </p>
                <label className="modal-field">
                    <span className="modal-label">Message</span>
                    <textarea
                        className="modal-textarea"
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                        placeholder="Ex. Les croix ne s’enregistrent plus sur la classe 6A…"
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
        </SettingsLayout>
    )
}
