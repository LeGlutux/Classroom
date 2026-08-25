import React, { useContext, useEffect, useState } from 'react'
import firebase from 'firebase/app'
import { AuthContext } from '../Auth'
import SettingsLayout from './SettingsLayout'
import ConfirmModal from './ConfirmModal'
import {
    DEFAULT_SMS_TEMPLATES,
    SmsTemplate,
    normalizeSmsTemplates,
} from '../sms'

const newTemplate = (): SmsTemplate => ({
    id: 'sms-' + Date.now(),
    title: 'Nouveau modèle',
    body:
        'Bonjour,\nJe vous contacte au sujet de {prénom} ({classe}).\nCordialement',
})

export default () => {
    const { currentUser } = useContext(AuthContext)
    const [templates, setTemplates] = useState<SmsTemplate[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [toast, setToast] = useState('')
    const [confirmReset, setConfirmReset] = useState(false)

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
                    Variables : {'{prénom}'}, {'{nom}'}, {'{classe}'}. Le
                    numéro des parents n’est jamais enregistré. Pour les
                    retrouver vite dans le téléphone, nomme les contacts du
                    type « TN 6A Léa Dupont ».
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
                                    onChange={(event) =>
                                        updateAt(index, {
                                            body: event.target.value,
                                        })
                                    }
                                />
                            </label>
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
