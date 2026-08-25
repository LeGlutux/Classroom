import React, { useContext, useEffect, useState } from 'react'
import firebase from 'firebase/app'
import { AuthContext } from '../Auth'
import SettingsLayout from './SettingsLayout'
import ConfirmModal from './ConfirmModal'
import { useIcons, useSmsConfig } from '../hooks'
import { buildCrossSlots, isAdminUser } from '../functions'
import {
    resolveUserSmsTemplates,
    SmsTemplate,
} from '../sms'
import SmsEditor from './SmsEditor'

export default () => {
    const { currentUser } = useContext(AuthContext)
    const uid = currentUser ? currentUser.uid : ''
    const { icons, positiveIcons } = useIcons(uid)
    const slots = buildCrossSlots(icons, positiveIcons)
    const { defaultTemplates, loading: configLoading, smsEnabled } = useSmsConfig()
    const [templates, setTemplates] = useState<SmsTemplate[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [toast, setToast] = useState('')
    const [confirmReset, setConfirmReset] = useState(false)

    useEffect(() => {
        if (!currentUser || configLoading) return
        let cancelled = false
        const load = async () => {
            const snap = await firebase
                .firestore()
                .collection('users')
                .doc(currentUser.uid)
                .get()
            if (cancelled) return
            setTemplates(
                resolveUserSmsTemplates(
                    snap.data() ? snap.data()!.smsTemplates : undefined,
                    defaultTemplates
                )
            )
            setLoading(false)
        }
        load()
        return () => {
            cancelled = true
        }
    }, [currentUser, configLoading])

    if (currentUser === null) return <div />
    if (configLoading) {
        return (
            <SettingsLayout title="Modèles SMS" backTo="/create">
                <p className="settings-panel-note">Chargement…</p>
            </SettingsLayout>
        )
    }
    if (!smsEnabled && !isAdminUser(currentUser)) {
        return (
            <SettingsLayout title="Modèles SMS" backTo="/create">
                <p className="settings-panel-note">
                    Cette fonction n’est pas encore disponible.
                </p>
            </SettingsLayout>
        )
    }

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

    return (
        <SettingsLayout title="Modèles SMS" backTo="/create" toast={toast}>
            <ConfirmModal
                confirm={confirmReset}
                setConfirm={setConfirmReset}
                confirmAction={() => save(defaultTemplates)}
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
                <SmsEditor
                    templates={templates}
                    setTemplates={setTemplates}
                    slots={slots}
                    saving={saving}
                    onSave={() => save(templates)}
                    resetLabel="Revenir aux modèles par défaut"
                    onReset={() => setConfirmReset(true)}
                />
            )}
        </SettingsLayout>
    )
}
