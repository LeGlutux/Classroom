import React from 'react'
import { AppelStudent, formatAppelStudentLabel } from '../pronote/appel'
import { IconClose } from './Icons'

type AppelConfirmModalProps = {
    open: boolean
    classe: string
    lessonLabel: string
    absents: AppelStudent[]
    submitting?: boolean
    error?: string | null
    needLink?: boolean
    onClose: () => void
    onQuitMode: () => void
    onConfirm: () => void
}

export default ({
    open,
    classe,
    lessonLabel,
    absents,
    submitting,
    error,
    needLink,
    onClose,
    onQuitMode,
    onConfirm,
}: AppelConfirmModalProps) => {
    if (!open) return null

    const count = absents.length
    const title =
        count === 0
            ? 'Aucun absent sélectionné'
            : count === 1
            ? '1 élève absent'
            : count + ' élèves absents'

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-card appel-confirm-modal"
                onClick={(event) => event.stopPropagation()}
            >
                <button
                    type="button"
                    className="seating-modal-close"
                    onClick={onClose}
                    aria-label="Fermer"
                >
                    <IconClose />
                </button>
                <div className="modal-empty">{title}</div>
                <div className="modal-sub">
                    Classe {classe} · {lessonLabel}
                </div>
                {count > 0 ? (
                    <ul className="appel-absent-list">
                        {absents.map((student) => (
                            <li key={student.id}>
                                {formatAppelStudentLabel(student)}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="appel-confirm-note">
                        Tous les élèves du plan seront considérés présents sur
                        l’heure en cours dans Pronote.
                    </p>
                )}
                {error ? <div className="modal-error">{error}</div> : null}
                <div className="modal-actions appel-confirm-actions">
                    <button
                        type="button"
                        className="modal-btn modal-btn-ghost"
                        onClick={onQuitMode}
                        disabled={!!submitting}
                    >
                        Quitter le mode
                    </button>
                    <button
                        type="button"
                        className="modal-btn modal-btn-primary"
                        onClick={onConfirm}
                        disabled={!!submitting}
                    >
                        {submitting
                            ? 'Envoi…'
                            : needLink
                            ? 'Lier Pronote'
                            : 'Valider l’appel Pronote'}
                    </button>
                </div>
            </div>
        </div>
    )
}
