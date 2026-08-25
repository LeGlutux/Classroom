import React, { useRef } from 'react'
import {
    CrossSlot,
    handleIcon,
} from '../functions'
import {
    SMS_TOKEN,
    SmsTemplate,
    insertSmsToken,
} from '../sms'

export const newSmsTemplate = (): SmsTemplate => ({
    id: 'sms-' + Date.now(),
    title: 'Nouveau modèle',
    body:
        'Bonjour,\nJe vous contacte au sujet de #prénom (#classe).\nCordialement',
})

type SmsEditorProps = {
    templates: SmsTemplate[]
    setTemplates: (next: SmsTemplate[]) => void
    slots: CrossSlot[]
    saving: boolean
    onSave: () => void
    resetLabel: string
    onReset: () => void
}

export default ({
    templates,
    setTemplates,
    slots,
    saving,
    onSave,
    resetLabel,
    onReset,
}: SmsEditorProps) => {
    const areaRefs = useRef<{ [id: string]: HTMLTextAreaElement | null }>({})

    const updateAt = (index: number, patch: Partial<SmsTemplate>) => {
        setTemplates(
            templates.map((template, i) =>
                i === index ? { ...template, ...patch } : template
            )
        )
    }

    const insertAt = (index: number, token: string) => {
        const template = templates[index]
        if (!template) return
        const area = areaRefs.current[template.id]
        const start = area ? area.selectionStart : template.body.length
        const end = area ? area.selectionEnd : template.body.length
        const next = insertSmsToken(template.body, token, start, end)
        updateAt(index, { body: next.body })
        window.setTimeout(() => {
            const field = areaRefs.current[template.id]
            if (!field) return
            field.focus()
            field.setSelectionRange(next.cursor, next.cursor)
        }, 0)
    }

    return (
        <React.Fragment>
            {templates.map((template, index) => (
                <div key={template.id} className="settings-panel">
                    <label className="modal-field" style={{ marginTop: 0 }}>
                        <span className="modal-label">Titre</span>
                        <input
                            className="modal-input"
                            value={template.title}
                            onChange={(event) =>
                                updateAt(index, { title: event.target.value })
                            }
                        />
                    </label>
                    <label className="modal-field">
                        <span className="modal-label">Texte</span>
                        <textarea
                            className="modal-textarea sms-template-body"
                            value={template.body}
                            ref={(node) => {
                                areaRefs.current[template.id] = node
                            }}
                            onChange={(event) =>
                                updateAt(index, { body: event.target.value })
                            }
                        />
                    </label>
                    <div className="sms-token-row">
                        <button
                            type="button"
                            className="sms-token-btn"
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={() => insertAt(index, SMS_TOKEN.prenom)}
                        >
                            prénom
                        </button>
                        <button
                            type="button"
                            className="sms-token-btn"
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={() => insertAt(index, SMS_TOKEN.nom)}
                        >
                            nom
                        </button>
                        <button
                            type="button"
                            className="sms-token-btn"
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={() => insertAt(index, SMS_TOKEN.classe)}
                        >
                            classe
                        </button>
                        <button
                            type="button"
                            className="sms-token-btn"
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={() => insertAt(index, SMS_TOKEN.date)}
                        >
                            date
                        </button>
                        {slots.map((slot) => {
                            const src = handleIcon(slot.icon)
                            return (
                                <button
                                    type="button"
                                    key={slot.type}
                                    className="sms-token-btn"
                                    onMouseDown={(event) =>
                                        event.preventDefault()
                                    }
                                    onClick={() =>
                                        insertAt(
                                            index,
                                            SMS_TOKEN.cross(slot.type)
                                        )
                                    }
                                >
                                    nombre de
                                    {src !== 'none' ? (
                                        <img src={src} alt="" />
                                    ) : null}
                                </button>
                            )
                        })}
                    </div>
                    <button
                        type="button"
                        className="settings-btn settings-btn-danger"
                        onClick={() =>
                            setTemplates(
                                templates.filter((_, i) => i !== index)
                            )
                        }
                    >
                        Supprimer ce modèle
                    </button>
                </div>
            ))}
            <div className="settings-panel">
                <button
                    type="button"
                    className="settings-btn sms-btn-secondary"
                    onClick={() =>
                        setTemplates(templates.concat([newSmsTemplate()]))
                    }
                >
                    Ajouter un modèle
                </button>
                <button
                    type="button"
                    className="settings-btn"
                    disabled={saving}
                    onClick={onSave}
                >
                    {saving ? 'Enregistrement…' : 'Enregistrer'}
                </button>
                <button
                    type="button"
                    className="settings-btn settings-btn-danger"
                    onClick={onReset}
                >
                    {resetLabel}
                </button>
            </div>
        </React.Fragment>
    )
}
