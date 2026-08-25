import React, { useContext, useEffect, useRef, useState } from 'react'
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
import { lockPageTouch, unlockPageTouch } from '../touchLock'

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
    const overlayRef = useRef<HTMLDivElement>(null)
    const sheetRef = useRef<HTMLDivElement>(null)
    const grabRef = useRef<HTMLDivElement>(null)
    const dragging = useRef(false)
    const startY = useRef(0)
    const dragY = useRef(0)
    const lastY = useRef(0)
    const lastT = useRef(0)
    const velocity = useRef(0)
    const locked = useRef(false)

    const releaseDragLock = () => {
        if (!locked.current) return
        locked.current = false
        unlockPageTouch()
    }

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
        releaseDragLock()
        setStudent(null)
        setBusy(false)
        dragY.current = 0
    }

    const resetSheetStyle = () => {
        const sheet = sheetRef.current
        const overlay = overlayRef.current
        if (sheet) {
            sheet.style.transition = ''
            sheet.style.transform = ''
        }
        if (overlay) overlay.style.background = ''
    }

    const applyDrag = (y: number, animate: boolean) => {
        const dy = Math.max(0, y)
        dragY.current = dy
        const sheet = sheetRef.current
        const overlay = overlayRef.current
        if (sheet) {
            sheet.style.transition = animate ? 'transform 0.22s ease' : 'none'
            sheet.style.transform = dy ? 'translateY(' + dy + 'px)' : ''
        }
        if (overlay) {
            overlay.style.transition = animate ? 'background 0.22s ease' : 'none'
            const dim = Math.max(0, 1 - dy / 360)
            overlay.style.background =
                'rgba(24, 24, 27, ' + (0.36 * dim).toFixed(3) + ')'
        }
    }

    const dismiss = () => {
        const sheet = sheetRef.current
        if (sheet) {
            sheet.style.transition = 'transform 0.2s ease'
            sheet.style.transform = 'translateY(110%)'
        }
        if (overlayRef.current) {
            overlayRef.current.style.transition = 'background 0.2s ease'
            overlayRef.current.style.background = 'rgba(24, 24, 27, 0)'
        }
        window.setTimeout(() => close(), 180)
    }

    const onGrabDown = (event: React.PointerEvent<HTMLDivElement>) => {
        dragging.current = true
        startY.current = event.clientY
        lastY.current = event.clientY
        lastT.current = Date.now()
        velocity.current = 0
        if (!locked.current) {
            locked.current = true
            lockPageTouch()
        }
        try {
            event.currentTarget.setPointerCapture(event.pointerId)
        } catch (error) {
            // Older browsers.
        }
        applyDrag(0, false)
    }

    const onGrabMove = (event: React.PointerEvent<HTMLDivElement>) => {
        if (!dragging.current) return
        const now = Date.now()
        const dy = event.clientY - startY.current
        const dt = Math.max(1, now - lastT.current)
        velocity.current = (event.clientY - lastY.current) / dt
        lastY.current = event.clientY
        lastT.current = now
        applyDrag(dy, false)
    }

    const onGrabUp = () => {
        if (!dragging.current) return
        dragging.current = false
        releaseDragLock()
        const shouldClose =
            dragY.current > 88 || velocity.current > 0.65
        if (shouldClose) {
            dismiss()
            return
        }
        applyDrag(0, true)
    }

    useEffect(() => {
        if (!student) {
            resetSheetStyle()
            releaseDragLock()
        }
        return () => releaseDragLock()
    }, [student])

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
                <div
                    ref={overlayRef}
                    className="sms-overlay"
                    onClick={dismiss}
                >
                    <div
                        ref={sheetRef}
                        className="sms-sheet"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div
                            ref={grabRef}
                            className="sms-sheet-grab"
                            onPointerDown={onGrabDown}
                            onPointerMove={onGrabMove}
                            onPointerUp={onGrabUp}
                            onPointerCancel={onGrabUp}
                        >
                            <div className="sms-sheet-handle" />
                            <div className="sms-sheet-kicker">
                                SMS aux parents
                            </div>
                            <div className="sms-sheet-title">
                                {student.prenom}
                            </div>
                        </div>
                        <div className="sms-sheet-body">
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
                </div>
            ) : null}
            {toast ? <div className="settings-toast sms-toast">{toast}</div> : null}
        </React.Fragment>
    )
}
