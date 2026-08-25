import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import firebase from 'firebase/app'
import { AuthContext } from '../Auth'
import {
    SmsStudent,
    SmsTemplate,
    canPickContacts,
    fillSmsTemplate,
    parseSmsConfig,
    pickContactPhone,
    resolveUserSmsTemplates,
    sendParentSms,
} from '../sms'

let openSheet: ((student: SmsStudent) => void) | null = null

export const openStudentSms = (student: SmsStudent) => {
    if (openSheet) openSheet(student)
}

export default () => {
    const { currentUser } = useContext(AuthContext)
    const [student, setStudent] = useState<SmsStudent | null>(null)
    const [templates, setTemplates] = useState<SmsTemplate[]>([])
    const [selectedId, setSelectedId] = useState('')
    const [toast, setToast] = useState('')
    const [busy, setBusy] = useState(false)
    const pickerAvailable = canPickContacts()

    useEffect(() => {
        openSheet = (next) => {
            setStudent(next)
            setSelectedId('')
        }
        return () => {
            openSheet = null
        }
    }, [])

    useEffect(() => {
        if (!student || !currentUser) return
        let cancelled = false
        const load = async () => {
            const db = firebase.firestore()
            const [userSnap, configSnap] = await Promise.all([
                db.collection('users').doc(currentUser.uid).get(),
                db.collection('props').doc('sms-config').get(),
            ])
            if (cancelled) return
            const config = parseSmsConfig(configSnap.data())
            const next = resolveUserSmsTemplates(
                userSnap.data() ? userSnap.data()!.smsTemplates : undefined,
                config.defaultTemplates
            )
            setTemplates(next)
            setSelectedId(next[0] ? next[0].id : '')
        }
        load()
        return () => {
            cancelled = true
        }
    }, [student, currentUser])

    useEffect(() => {
        if (!toast) return
        const timer = window.setTimeout(() => setToast(''), 4000)
        return () => window.clearTimeout(timer)
    }, [toast])

    const selected =
        templates.find((template) => template.id === selectedId) || null

    const close = () => {
        setStudent(null)
        setBusy(false)
    }

    const send = async (tel?: string) => {
        if (!student || !selected) return
        setBusy(true)
        sendParentSms(student, selected, tel)
        setToast(
            'Prénom copié : ' +
                student.prenom +
                ' — colle-le dans la recherche Contacts ou Messages.'
        )
        close()
    }

    const sendWithContact = async () => {
        if (!student || !selected) return
        setBusy(true)
        try {
            const tel = await pickContactPhone()
            if (!tel) {
                setBusy(false)
                return
            }
            sendParentSms(student, selected, tel)
            setToast(
                'Prénom copié : ' +
                    student.prenom +
                    ' — colle-le dans la recherche si besoin.'
            )
            close()
        } catch (error) {
            setBusy(false)
        }
    }

    return (
        <React.Fragment>
            {student ? (
                <div className="sms-overlay" onClick={close}>
                    <div
                        className="sms-sheet"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="sms-sheet-handle" />
                        <div className="sms-sheet-kicker">SMS aux parents</div>
                        <div className="sms-sheet-title">{student.prenom}</div>
                        <p className="sms-sheet-note">
                            Le prénom sera copié. Colle-le dans la recherche
                            pour retrouver le contact
                            {student.classe
                                ? ' (ex. ' +
                                  student.classe +
                                  ' - ' +
                                  student.prenom +
                                  ' ' +
                                  student.nom +
                                  ')'
                                : ''}
                            . Aucun numéro n’est enregistré dans l’app.
                        </p>
                        {templates.length === 0 ? (
                            <p className="sms-sheet-note">
                                Aucun modèle pour l’instant.{' '}
                                <Link to="/create/sms" onClick={close}>
                                    En ajouter dans les paramètres
                                </Link>
                                .
                            </p>
                        ) : (
                            <div className="sms-template-list">
                                {templates.map((template) => (
                                    <button
                                        type="button"
                                        key={template.id}
                                        className={`sms-template-choice${
                                            template.id === selectedId
                                                ? ' is-selected'
                                                : ''
                                        }`}
                                        onClick={() =>
                                            setSelectedId(template.id)
                                        }
                                    >
                                        <span className="sms-template-choice-title">
                                            {template.title}
                                        </span>
                                        <span className="sms-template-choice-body">
                                            {fillSmsTemplate(
                                                template.body,
                                                student
                                            )}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                        <div className="sms-sheet-actions">
                            <button
                                type="button"
                                className="settings-btn"
                                disabled={!selected || busy}
                                onClick={() => send()}
                            >
                                Ouvrir Messages
                            </button>
                            {pickerAvailable ? (
                                <button
                                    type="button"
                                    className="settings-btn sms-btn-secondary"
                                    disabled={!selected || busy}
                                    onClick={sendWithContact}
                                >
                                    Choisir un parent dans les contacts
                                </button>
                            ) : null}
                            <Link
                                className="sms-sheet-link"
                                to="/create/sms"
                                onClick={close}
                            >
                                Modifier les modèles
                            </Link>
                        </div>
                    </div>
                </div>
            ) : null}
            {toast ? <div className="settings-toast sms-toast">{toast}</div> : null}
        </React.Fragment>
    )
}
