import React, { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AuthContext } from '../Auth'
import Firebase from '../firebase'
import { markTutorialCompleted } from '../database'
import { isAdminUser } from '../functions'
import { parseSmsConfig } from '../sms'
import {
    TUTORIAL_REPLAY_EVENT,
    TutorialStep,
    getTutorialSteps,
    notifyTutorialCompleted,
} from '../tutorial'
import {
    IconChat,
    IconCheck,
    IconGrid,
    IconNote,
    IconPlay,
    IconUser,
    IconUsers,
} from './Icons'
import TutorialFakeApp from './TutorialStage'

const AUTH_PATHS = ['/login', '/signup']

const stepIcon = (id: TutorialStep['id']) => {
    if (id === 'classes' || id === 'classes-nav') return <IconUsers />
    if (id === 'crosses' || id === 'crosses-nav') return <IconGrid />
    if (id === 'cards-sms') return <IconChat />
    if (id.indexOf('cards') === 0) return <IconUser />
    if (id === 'lists') return <IconNote />
    if (id === 'ready') return <IconCheck />
    return <IconPlay />
}

const AppTutorialHost = () => {
    const { currentUser } = useContext(AuthContext)
    const location = useLocation()
    const [smsEnabled, setSmsEnabled] = useState(false)
    const [open, setOpen] = useState(false)
    const [step, setStep] = useState(0)

    useEffect(() => {
        if (!currentUser) {
            setSmsEnabled(false)
            setOpen(false)
            return
        }
        const unsubSms = Firebase.firestore()
            .collection('props')
            .doc('sms-config')
            .onSnapshot(
                (snap) => {
                    setSmsEnabled(parseSmsConfig(snap.data()).smsEnabled)
                },
                () => {
                    setSmsEnabled(false)
                }
            )
        return () => {
            unsubSms()
        }
    }, [currentUser])

    useEffect(() => {
        const onReplay = () => {
            setStep(0)
            setOpen(true)
        }
        window.addEventListener(TUTORIAL_REPLAY_EVENT, onReplay)
        return () => {
            window.removeEventListener(TUTORIAL_REPLAY_EVENT, onReplay)
        }
    }, [])

    useEffect(() => {
        if (!open) return
        const previous = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = previous
        }
    }, [open])

    const close = async () => {
        setOpen(false)
        setStep(0)
        notifyTutorialCompleted()
        if (currentUser) {
            try {
                await markTutorialCompleted(currentUser.uid)
            } catch (error) {
                // L’overlay est déjà fermé.
            }
        }
    }

    if (!open || !currentUser) return null
    if (AUTH_PATHS.indexOf(location.pathname) !== -1) return null

    const showSms = smsEnabled || isAdminUser(currentUser)
    const steps = getTutorialSteps(showSms)
    const index = Math.min(step, steps.length - 1)
    const current = steps[index]
    const last = index === steps.length - 1
    const staged = !!current.stage

    const goNext = () => {
        if (last) {
            close()
            return
        }
        setStep(index + 1)
    }

    const speech = (
        <div
            className={`modal-card tutorial-card${staged ? ' is-compact' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="tutorial-title"
        >
            <div className="tutorial-kicker">
                Visite guidée {index + 1} / {steps.length}
            </div>
            {staged ? null : (
                <div className="tutorial-icon">{stepIcon(current.id)}</div>
            )}
            <div className="tutorial-title" id="tutorial-title">
                {current.title}
            </div>
            <p className="tutorial-body">{current.body}</p>
            {current.hint ? (
                <div className="tutorial-hint">{current.hint}</div>
            ) : null}
            <div className="tutorial-dots" role="tablist" aria-label="Étapes">
                {steps.map((item, itemIndex) => (
                    <button
                        key={item.id}
                        type="button"
                        className={`tutorial-dot${
                            itemIndex === index ? ' is-on' : ''
                        }`}
                        aria-label={`Étape ${itemIndex + 1}`}
                        aria-current={itemIndex === index ? 'step' : undefined}
                        onClick={() => setStep(itemIndex)}
                    />
                ))}
            </div>
            <div className="tutorial-actions">
                <button
                    type="button"
                    className="modal-btn modal-btn-ghost"
                    onClick={close}
                >
                    Passer
                </button>
                <div className="tutorial-actions-end">
                    {index > 0 ? (
                        <button
                            type="button"
                            className="modal-btn modal-btn-ghost"
                            onClick={() => setStep(index - 1)}
                        >
                            Retour
                        </button>
                    ) : null}
                    <button
                        type="button"
                        className="modal-btn modal-btn-primary"
                        onClick={goNext}
                    >
                        {last ? 'C’est parti' : 'Continuer'}
                    </button>
                </div>
            </div>
        </div>
    )

    if (!staged) {
        return (
            <div className="tutorial-root is-centered" role="presentation">
                <div className="tutorial-dim is-full" />
                {speech}
            </div>
        )
    }

    return (
        <div className="tutorial-root is-stage" role="presentation">
            <TutorialFakeApp
                stage={current.stage!}
                highlight={current.highlight}
                demo={current.demo}
                onAdvance={goNext}
            >
                <div className="tutorial-speech">{speech}</div>
            </TutorialFakeApp>
        </div>
    )
}

export default AppTutorialHost
