import React from 'react'

interface ConfirmModalProps {
    confirm: boolean
    confirmAction: () => void
    setConfirm: React.Dispatch<React.SetStateAction<boolean>>
    textBox: string
    subTextBox?: string
}

export default ({
    confirm,
    confirmAction,
    setConfirm,
    textBox,
    subTextBox,
}: ConfirmModalProps) => {
    if (!confirm) return null
    return (
        <div className="modal-overlay">
            <div className={`modal-card ${confirm ? 'entering-t' : ''}`}>
                <button
                    className="header-icon-btn"
                    style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
                    onClick={() => setConfirm(false)}
                    type="button"
                    aria-label="Fermer"
                >
                    <svg viewBox="0 0 20 20">
                        <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                    </svg>
                </button>
                <div className="empty-state-title" style={{ fontSize: '1.35rem' }}>
                    {textBox}
                </div>
                {subTextBox && (
                    <div className="empty-state-text" style={{ marginTop: '0.75rem' }}>
                        {subTextBox}
                    </div>
                )}
                <div className="modal-actions">
                    <button
                        className="btn-ghost"
                        type="button"
                        onClick={() => setConfirm(false)}
                    >
                        Annuler
                    </button>
                    <button
                        className="btn-secondary"
                        type="button"
                        onClick={() => {
                            confirmAction()
                            setConfirm(false)
                        }}
                    >
                        Confirmer
                    </button>
                </div>
            </div>
        </div>
    )
}
