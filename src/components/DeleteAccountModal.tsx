import React, { useState } from 'react'
import { IconLock } from './Icons'
import { deleteAccountErrorMessage, deleteOwnAccount } from '../deleteAccount'

type DeleteAccountModalProps = {
    open: boolean
    onClose: () => void
}

const DeleteAccountModal = ({ open, onClose }: DeleteAccountModalProps) => {
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [busy, setBusy] = useState(false)

    if (!open) return null

    const close = () => {
        if (busy) return
        setPassword('')
        setError('')
        onClose()
    }

    const submit = async () => {
        if (busy) return
        setError('')
        setBusy(true)
        try {
            await deleteOwnAccount(password)
        } catch (err) {
            setBusy(false)
            setError(deleteAccountErrorMessage(err as { code?: string }))
        }
    }

    return (
        <div className="modal-overlay" onClick={close}>
            <div
                className="modal-card"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="modal-empty">Supprimer le compte ?</div>
                <div className="modal-sub">
                    Classes, élèves, croix, listes et le login seront effacés.
                    Cette action est définitive.
                </div>
                <label className="modal-field">
                    <span className="modal-label">Mot de passe</span>
                    <span className="auth-field">
                        <IconLock />
                        <input
                            type="password"
                            name="delete-account-password"
                            autoComplete="current-password"
                            placeholder="Mot de passe"
                            value={password}
                            disabled={busy}
                            onChange={(event) => setPassword(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') submit()
                            }}
                        />
                    </span>
                </label>
                {error ? <div className="modal-error">{error}</div> : null}
                <div className="modal-actions">
                    <button
                        type="button"
                        className="modal-btn modal-btn-ghost"
                        disabled={busy}
                        onClick={close}
                    >
                        Annuler
                    </button>
                    <button
                        type="button"
                        className="modal-btn modal-btn-danger"
                        disabled={busy || !password.trim()}
                        onClick={submit}
                    >
                        {busy ? 'Suppression…' : 'Supprimer définitivement'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DeleteAccountModal
