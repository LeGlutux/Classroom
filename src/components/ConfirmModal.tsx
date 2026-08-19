import React from 'react'

interface ConfirmModalProps {
    confirm: boolean
    confirmAction: () => void
    setConfirm: React.Dispatch<React.SetStateAction<boolean>>
    textBox: string
    subTextBox?: string
    danger?: boolean
}

export default ({
    confirm,
    confirmAction,
    setConfirm,
    textBox,
    subTextBox,
    danger,
}: ConfirmModalProps) => {
    if (!confirm) return null

    return (
        <div className="modal-overlay" onClick={() => setConfirm(false)}>
            <div
                className="modal-card"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="modal-empty">{textBox}</div>
                {subTextBox ? <div className="modal-sub">{subTextBox}</div> : null}
                <div className="modal-actions">
                    <button
                        type="button"
                        className="modal-btn modal-btn-ghost"
                        onClick={() => setConfirm(false)}
                    >
                        Annuler
                    </button>
                    <button
                        type="button"
                        className={`modal-btn ${
                            danger ? 'modal-btn-danger' : 'modal-btn-primary'
                        }`}
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
