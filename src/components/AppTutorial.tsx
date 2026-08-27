import React, { useContext, useEffect, useRef, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
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
    IconUser,
    IconUsers,
} from './Icons'
import TutorialDemoCard from './TutorialDemoCard'

const AUTH_PATHS = ['/login', '/signup']
const SPOT_PAD = 8

type SpotRect = {
    top: number
    left: number
    width: number
    height: number
    bottom: number
    right: number
}

const stepIcon = (id: TutorialStep['id']) => {
    if (id === 'classes' || id === 'classes-nav') return <IconUsers />
    if (id === 'crosses' || id === 'crosses-nav') return <IconGrid />
    if (id === 'cards-sms') return <IconChat />
    if (id.indexOf('cards') === 0) return <IconUser />
    if (id === 'lists') return <IconNote />
    if (id === 'ready') return <IconCheck />
    return <IconPlay />
}

const readSpotRect = (spot?: string): SpotRect | null => {
    if (!spot) return null
    const el = document.querySelector(
        '[data-tutorial-spot="' + spot + '"]'
    ) as HTMLElement | null
    if (!el) return null
    const r = el.getBoundingClientRect()
    if (r.width < 2 || r.height < 2) return null
    const top = Math.max(0, r.top - SPOT_PAD)
    const left = Math.max(0, r.left - SPOT_PAD)
    const right = Math.min(window.innerWidth, r.right + SPOT_PAD)
    const bottom = Math.min(window.innerHeight, r.bottom + SPOT_PAD)
    return {
        top,
        left,
        width: Math.max(0, right - left),
        height: Math.max(0, bottom - top),
        bottom,
        right,
    }
}

const rectsEqual = (a: SpotRect | null, b: SpotRect | null) => {
    if (a === b) return true
    if (!a || !b) return false
    return (
        Math.abs(a.top - b.top) < 0.5 &&
        Math.abs(a.left - b.left) < 0.5 &&
        Math.abs(a.width - b.width) < 0.5 &&
        Math.abs(a.height - b.height) < 0.5
    )
}

const AppTutorialHost = () => {
    const { currentUser } = useContext(AuthContext)
    const location = useLocation()
    const history = useHistory()
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
    const [holeRect, setHoleRect] = useState<SpotRect | null>(null)
    const [ringRect, setRingRect] = useState<SpotRect | null>(null)
    const [demoRect, setDemoRect] = useState<SpotRect | null>(null)
    const skipAutoRef = useRef(false)
    const scrolledSpotRef = useRef('')

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
            scrolledSpotRef.current = ''
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

    const showSms = !!(currentUser && (smsEnabled || isAdminUser(currentUser)))
    const steps = getTutorialSteps(showSms)
    const index = Math.min(step, steps.length - 1)
    const current = steps[index]
    const last = index === steps.length - 1
    const currentId = current ? current.id : ''
    const currentRoute = current ? current.route : undefined
    const currentSpot = current ? current.spot : undefined
    const currentRing = current ? current.ring || current.spot : undefined
    const advanceOnSpotClick = !!(current && current.advanceOnSpotClick)

    useEffect(() => {
        if (!open || !currentRoute) return
        if (location.pathname !== currentRoute) {
            history.push(currentRoute)
        }
    }, [open, currentRoute, history, location.pathname])

    useEffect(() => {
        if (!open) {
            setHoleRect(null)
            setRingRect(null)
            setDemoRect(null)
            return
        }
        let cancelled = false
        const tick = () => {
            if (cancelled) return
            const holeRaw = readSpotRect(currentSpot)
            const hole =
                holeRaw && holeRaw.height > window.innerHeight * 0.46
                    ? {
                          ...holeRaw,
                          height: window.innerHeight * 0.46,
                          bottom: holeRaw.top + window.innerHeight * 0.46,
                      }
                    : holeRaw
            const ring = readSpotRect(currentRing) || hole
            const demo = readSpotRect('demo-card')
            setHoleRect((prev) => (rectsEqual(prev, hole) ? prev : hole))
            setRingRect((prev) => (rectsEqual(prev, ring) ? prev : ring))
            setDemoRect((prev) => (rectsEqual(prev, demo) ? prev : demo))
            if (hole && currentSpot && scrolledSpotRef.current !== currentSpot) {
                const el = document.querySelector(
                    '[data-tutorial-spot="' + currentSpot + '"]'
                ) as HTMLElement | null
                if (el && el.scrollIntoView) {
                    scrolledSpotRef.current = currentSpot
                    el.scrollIntoView({
                        block: 'center',
                        inline: 'nearest',
                    })
                }
            }
        }
        tick()
        const interval = window.setInterval(tick, 200)
        window.addEventListener('resize', tick)
        window.addEventListener('scroll', tick, true)
        return () => {
            cancelled = true
            window.clearInterval(interval)
            window.removeEventListener('resize', tick)
            window.removeEventListener('scroll', tick, true)
        }
    }, [open, currentSpot, currentRing, location.pathname, currentId])

    useEffect(() => {
        if (!open || !advanceOnSpotClick || !currentSpot) return
        const onClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement | null
            if (!target || !target.closest) return
            if (
                target.closest(
                    '[data-tutorial-spot="' + currentSpot + '"]'
                )
            ) {
                setStep((value) => value + 1)
            }
        }
        document.addEventListener('click', onClick, true)
        return () => {
            document.removeEventListener('click', onClick, true)
        }
    }, [open, currentSpot, advanceOnSpotClick, currentId])

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

    if (!open || !currentUser || !current) return null
    if (AUTH_PATHS.indexOf(location.pathname) !== -1) return null

    const showDemo = current.demo === 'card' || current.demo === 'swipe'
    const hasHole = !!(currentSpot && holeRect)
    const compact = !!(current.spot || showDemo)

    let cardStyle: React.CSSProperties | undefined
    const anchor = hasHole && holeRect ? holeRect : showDemo ? demoRect : null
    if (anchor) {
        const estimated = compact ? 210 : 280
        const spaceBelow = window.innerHeight - anchor.bottom
        const placeBelow = spaceBelow > estimated + 12
        cardStyle = {
            position: 'fixed',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '92%',
            maxWidth: '26rem',
            zIndex: 98,
            top: placeBelow ? anchor.bottom + 12 : undefined,
            bottom: placeBelow
                ? undefined
                : Math.max(12, window.innerHeight - anchor.top + 12),
        }
    }

    return (
        <div
            className={`tutorial-root${hasHole ? ' has-hole' : ''}`}
            role="presentation"
        >
            {hasHole && holeRect ? (
                <React.Fragment>
                    <div
                        className="tutorial-dim"
                        style={{
                            top: 0,
                            left: 0,
                            right: 0,
                            height: holeRect.top,
                        }}
                    />
                    <div
                        className="tutorial-dim"
                        style={{
                            top: holeRect.bottom,
                            left: 0,
                            right: 0,
                            bottom: 0,
                        }}
                    />
                    <div
                        className="tutorial-dim"
                        style={{
                            top: holeRect.top,
                            left: 0,
                            width: holeRect.left,
                            height: holeRect.height,
                        }}
                    />
                    <div
                        className="tutorial-dim"
                        style={{
                            top: holeRect.top,
                            left: holeRect.right,
                            right: 0,
                            height: holeRect.height,
                        }}
                    />
                    {current.spotInteractive ? null : (
                        <div
                            className="tutorial-hole-block"
                            style={{
                                top: holeRect.top,
                                left: holeRect.left,
                                width: holeRect.width,
                                height: holeRect.height,
                            }}
                        />
                    )}
                </React.Fragment>
            ) : (
                <div className="tutorial-dim is-full" />
            )}

            {ringRect ? (
                <div
                    className="tutorial-ring"
                    style={{
                        top: ringRect.top,
                        left: ringRect.left,
                        width: ringRect.width,
                        height: ringRect.height,
                    }}
                />
            ) : null}

            {showDemo ? (
                <div className="tutorial-demo-slot">
                    <TutorialDemoCard
                        swipe={current.demo === 'swipe'}
                        interactive={
                            current.id === 'cards-cross' ||
                            current.id === 'cards-note'
                        }
                    />
                </div>
            ) : null}

            <div
                className={`modal-card tutorial-card${
                    compact ? ' is-compact' : ''
                }`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="tutorial-title"
                style={cardStyle}
            >
                <div className="tutorial-kicker">
                    Visite guidée {index + 1} / {steps.length}
                </div>
                {compact ? null : (
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
