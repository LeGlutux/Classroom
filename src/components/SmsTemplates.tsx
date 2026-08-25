import React, { useContext, useEffect, useRef, useState } from 'react'
import firebase from 'firebase/app'
import { AuthContext } from '../Auth'
import SettingsLayout from './SettingsLayout'
import ConfirmModal from './ConfirmModal'
import { useIcons } from '../hooks'
import {
    buildCrossSlots,
    handleIcon,
} from '../functions'
import {
    DEFAULT_SMS_TEMPLATES,
    SMS_TOKEN,
    SmsTemplate,
    insertSmsToken,
    normalizeSmsTemplates,
} from '../sms'

const newTemplate = (): SmsTemplate => ({
    id: 'sms-' + Date.now(),
    title: 'Nouveau modèle',
    body:
        'Bonjour,\nJe vous contacte au sujet de #prénom (#classe).\nCordialement',
})

export default () => {
    const { currentUser } = useContext(AuthContext)
    const uid = currentUser ? currentUser.uid : ''
    const { icons, positiveIcons } = useIcons(uid)
    const slots = buildCrossSlots(icons, positiveIcons)
    const [templates, setTemplates] = useState<SmsTemplate[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [toast, setToast] = useState('')
    const [confirmReset, setConfirmReset] = useState(false)
    const areaRefs = useRef<{ [id: string]: HTMLTextAreaElement | null }>({})

    useEffect(() => {
        if (!currentUser) return
        let cancelled = false
        const load = async () => {
            const snap = await firebase
                .firestore()
                .collection('users')
                .doc(currentUser.uid)
                .get()
            if (cancelled) return
            setTemplates(
                normalizeSmsTemplates(
                    snap.data() ? snap.data()!.smsTemplates : undefined
                )
            )
            setLoading(false)
        }
        load()
        return () => {
            cancelled = true
        }
    }, [currentUser])

    if (currentUser === null) return <div />

    const save = async (next: SmsTemplate[]) => {
        setSaving(true)
        await firebase
            .firestore()
            .collection('users')
            .doc(currentUser.uid)
            .update({ smsTemplates: next })
        setTemplates(next)
        setSaving(false)
        setToast('Modèles enregistrés')
        window.setTimeout(() => setToast(''), 2500)
    }

    const updateAt = (index: number, patch: Partial<SmsTemplate>) => {
        const next = templates.map((template, i) =>
            i === index ? { ...template, ...patch } : template
        )
        setTemplates(next)
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

    const tokenButtons = (index: number) => (
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
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() =>
                            insertAt(index, SMS_TOKEN.cross(slot.type))
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
    )

    return (
        <SettingsLayout title="Modèles SMS" backTo="/create" toast={toast}>
            <ConfirmModal
                confirm={confirmReset}
                setConfirm={setConfirmReset}
                confirmAction={() => {
                    const next = DEFAULT_SMS_TEMPLATES.map((template) => ({
                        id: template.id,
                        title: template.title,
                        body: template.body,
                    }))
                    save(next)
                }}
                textBox="Revenir aux modèles par défaut ?"
                subTextBox="Tes modèles actuels seront remplacés."
            />
            <div className="settings-panel">
                <p className="settings-panel-note" style={{ textAlign: 'left' }}>
                    Swipe une carte élève vers la droite pour envoyer un SMS.
                    Les boutons ci-dessous insèrent un jeton (#prénom, #nom…)
                    remplacé à l’envoi. Aucun numéro n’est enregistré. Pour
                    retrouver vite les parents, nomme les contacts du type
                    « 6A - Léa Dupont ».
                </p>
            </div>
            {loading ? (
                <p className="settings-panel-note">Chargement…</p>
            ) : (
                <React.Fragment>
                    {templates.map((template, index) => (
                        <div key={template.id} className="settings-panel">
                            <label className="modal-field" style={{ marginTop: 0 }}>
                                <span className="modal-label">Titre</span>
                                <input
                                    className="modal-input"
                                    value={template.title}
                                    onChange={(event) =>
                                        updateAt(index, {
                                            title: event.target.value,
                                        })
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
                                        updateAt(index, {
                                            body: event.target.value,
                                        })
                                    }
                                />
                            </label>
                            {tokenButtons(index)}
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
                                setTemplates(templates.concat([newTemplate()]))
                            }
                        >
                            Ajouter un modèle
                        </button>
                        <button
                            type="button"
                            className="settings-btn"
                            disabled={saving}
                            onClick={() => save(templates)}
                        >
                            {saving ? 'Enregistrement…' : 'Enregistrer'}
                        </button>
                        <button
                            type="button"
                            className="settings-btn settings-btn-danger"
                            onClick={() => setConfirmReset(true)}
                        >
                            Revenir aux modèles par défaut
                        </button>
                    </div>
                </React.Fragment>
            )}
        </SettingsLayout>
    )
}
