import React, { useContext, useEffect, useRef, useState } from 'react'
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
    shouldAutoStartTutorial,
} from '../tutorial'
import {
    IconChat,
    IconCheck,
    IconGrid,
    IconNote,
    IconPlay,
    IconUsers,
} from './Icons'
import addPage from '../images/addPage.png'
import home from '../images/home.png'
import list from '../images/list.png'

const AUTH_PATHS = ['/login', '/signup']

const stepIcon = (id: TutorialStep['id']) => {
    if (id === 'classes') return <IconUsers />
    if (id === 'cards') return <IconGrid />
    if (id === 'lists') return <IconNote />
    if (id === 'sms') return <IconChat />
    if (id === 'ready') return <IconCheck />
    return <IconPlay />
}

const NavHint = ({ active }: { active?: TutorialStep['nav'] }) => {
    if (!active) return null
    return (
        <div className="tutorial-nav-hint" aria-hidden="true">
            <img
                className={active === 'settings' ? '' : 'nav-icon-inactive'}
                src={addPage}
                alt=""
            />
            <img
                className={active === 'home' ? '' : 'nav-icon-inactive'}
                src={home}
                alt=""
            />
            <img
                className={active === 'lists' ? '' : 'nav-icon-inactive'}
                src={list}
                alt=""
            />
        </div>
    )
}

const AppTutorialHost = () => {
    const { currentUser } = useContext(AuthContext)
    const location = useLocation()
    const [userDoc, setUserDoc] = useState<{
        tutorialCompleted?: boolean
        classes?: string[]
    } | null>(null)
    const [userLoaded, setUserLoaded] = useState(false)
    const [smsEnabled, setSmsEnabled] = useState(false)
    const [smsLoading, setSmsLoading] = useState(true)
    const [open, setOpen] = useState(false)
    const [forced, setForced] = useState(false)
    const [step, setStep] = useState(0)
    const skipAutoRef = useRef(false)

    useEffect(() => {
        if (!currentUser) {
            setUserDoc(null)
            setUserLoaded(false)
            setSmsEnabled(false)
            setSmsLoading(false)
            setOpen(false)
            setForced(false)
            skipAutoRef.current = false
            return
        }
        setUserLoaded(false)
        setSmsLoading(true)
        const unsubUser = Firebase.firestore()
            .collection('users')
            .doc(currentUser.uid)
            .onSnapshot(
                (snap) => {
                    const data = snap.data()
                    setUserDoc(
                        data
                            ? {
                                  tutorialCompleted: data.tutorialCompleted,
                                  classes: data.classes,
                              }
                            : null
                    )
                    setUserLoaded(true)
                },
                () => {
                    setUserLoaded(true)
                }
            )
        const unsubSms = Firebase.firestore()
            .collection('props')
            .doc('sms-config')
            .onSnapshot(
                (snap) => {
                    setSmsEnabled(parseSmsConfig(snap.data()).smsEnabled)
                    setSmsLoading(false)
                },
                () => {
                    setSmsLoading(false)
                }
            )
        return () => {
            unsubUser()
            unsubSms()
        }
    }, [currentUser])

    useEffect(() => {
        const onReplay = () => {
            skipAutoRef.current = true
            setForced(true)
            setStep(0)
            setOpen(true)
        }
        window.addEventListener(TUTORIAL_REPLAY_EVENT, onReplay)
        return () => {
            window.removeEventListener(TUTORIAL_REPLAY_EVENT, onReplay)
        }
    }, [])

    useEffect(() => {
        if (!currentUser || !userLoaded || smsLoading) return
        if (AUTH_PATHS.indexOf(location.pathname) !== -1) return
        if (open || forced || skipAutoRef.current) return
        if (shouldAutoStartTutorial(userDoc)) {
            setStep(0)
            setOpen(true)
        }
    }, [
        currentUser,
        userDoc,
        userLoaded,
        smsLoading,
        location.pathname,
        open,
        forced,
    ])

    useEffect(() => {
        if (!open) return
        const previous = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = previous
        }
    }, [open])

    const close = async () => {
        skipAutoRef.current = true
        setOpen(false)
        setForced(false)
        setStep(0)
        if (currentUser) {
            try {
                await markTutorialCompleted(currentUser.uid)
            } catch (error) {
                // L’overlay est déjà fermé ; le prochain chargement pourra le rouvrir.
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

    return (
        <div className="modal-overlay tutorial-overlay" role="presentation">
            <div
                className="modal-card tutorial-card"
                role="dialog"
                aria-modal="true"
                aria-labelledby="tutorial-title"
            >
                <div className="tutorial-kicker">
                    Tutoriel {index + 1} / {steps.length}
                </div>
                <div className="tutorial-icon">{stepIcon(current.id)}</div>
                <div className="tutorial-title" id="tutorial-title">
                    {current.title}
                </div>
                <p className="tutorial-body">{current.body}</p>
                {current.hint ? (
                    <div className="tutorial-hint">{current.hint}</div>
                ) : null}
                <NavHint active={current.nav} />
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
                            onClick={() => {
                                if (last) {
                                    close()
                                    return
                                }
                                setStep(index + 1)
                            }}
                        >
                            {last ? 'C’est parti' : 'Continuer'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AppTutorialHost
