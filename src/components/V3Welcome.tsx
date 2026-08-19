import React, { useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from '../Auth'

const STORAGE_KEY = 'thotnote.v3.welcome'
const REPLAY_EVENT = 'thotnote-replay-v3'
const CURSIVE = 'libère ta pédagogie.'
const PRECIOUS = 'pédagogie'
const PRECIOUS_START = CURSIVE.indexOf(PRECIOUS)
const SUBTITLE = 'Le plus célèbre cahier de note virtuel vous présente sa V3.'
const CURSIVE_CHARS = Array.from(CURSIVE)

const hasSeenWelcome = () => {
    try {
        return window.localStorage.getItem(STORAGE_KEY) === '1'
    } catch (error) {
        return true
    }
}

const markWelcomeSeen = () => {
    try {
        window.localStorage.setItem(STORAGE_KEY, '1')
    } catch (error) {
        // Ignore private-mode storage errors.
    }
}

const prefersReducedMotion = () => {
    if (typeof window === 'undefined' || !window.matchMedia) return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

const isPreciousLetter = (index: number) =>
    index >= PRECIOUS_START && index < PRECIOUS_START + PRECIOUS.length

const letterDelayMs = (index: number) => {
    if (index < PRECIOUS_START) return index * 90
    const preciousBase = PRECIOUS_START * 90 + 340
    if (index >= PRECIOUS_START + PRECIOUS.length) {
        return preciousBase + (PRECIOUS.length - 1) * 200 + 380
    }
    return preciousBase + (index - PRECIOUS_START) * 200
}

export const replayV3Welcome = () => {
    window.dispatchEvent(new Event(REPLAY_EVENT))
}

export default () => {
    const { currentUser } = useContext(AuthContext)
    const [visible, setVisible] = useState(false)
    const [leaving, setLeaving] = useState(false)
    const [step, setStep] = useState(0)
    const [playId, setPlayId] = useState(0)
    const [dropped, setDropped] = useState(0)
    const dismissGen = useRef(0)

    const startPlayback = () => {
        dismissGen.current += 1
        setLeaving(false)
        setDropped(0)
        setStep(prefersReducedMotion() ? 6 : 0)
        setVisible(true)
        setPlayId((id) => id + 1)
    }

    useEffect(() => {
        if (!currentUser || hasSeenWelcome()) return
        startPlayback()
    }, [currentUser])

    useEffect(() => {
        const onReplay = () => {
            if (!currentUser) return
            startPlayback()
        }
        window.addEventListener(REPLAY_EVENT, onReplay)
        return () => {
            window.removeEventListener(REPLAY_EVENT, onReplay)
        }
    }, [currentUser])

    useEffect(() => {
        if (!visible || prefersReducedMotion()) return
        setStep(0)
        const timers = [
            window.setTimeout(() => setStep(1), 450),
            window.setTimeout(() => setStep(2), 1400),
            window.setTimeout(() => setStep(3), 3100),
            window.setTimeout(() => setStep(4), 4400),
            window.setTimeout(() => setStep(5), 8800),
            window.setTimeout(() => setStep(6), 10000),
        ]
        return () => {
            timers.forEach((id) => window.clearTimeout(id))
        }
    }, [playId, visible])

    useEffect(() => {
        if (!visible) return
        if (prefersReducedMotion()) {
            setDropped(CURSIVE_CHARS.length)
            return
        }
        if (step < 4) {
            setDropped(0)
            return
        }
        const timers = CURSIVE_CHARS.map((_, index) =>
            window.setTimeout(() => {
                setDropped((count) => Math.max(count, index + 1))
            }, letterDelayMs(index))
        )
        return () => {
            timers.forEach((id) => window.clearTimeout(id))
        }
        // On ne relance pas la chute quand step passe à 5 ou 6.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [step >= 4, playId, visible])

    const dismiss = () => {
        if (step < 5 || leaving) return
        setLeaving(true)
        const gen = ++dismissGen.current
        window.setTimeout(() => {
            if (gen !== dismissGen.current) return
            markWelcomeSeen()
            setVisible(false)
        }, 900)
    }

    if (!visible) return null

    return (
        <div
            className={`v3-welcome ${leaving ? 'is-leaving' : ''}`}
            onClick={dismiss}
            role="dialog"
            aria-label="Bienvenue sur Thòt Note V3"
        >
            <div className="v3-welcome-grain" aria-hidden="true" />
            <div className="v3-welcome-inner">
                <div className={`v3-welcome-maison ${step >= 1 ? 'is-in' : ''}`}>
                    Maison Thòt — Été 2026
                </div>
                <div className={`v3-welcome-line ${step >= 2 ? 'is-in' : ''}`}>
                    Bienvenue sur Thòt Note
                </div>
                <div className={`v3-welcome-v3 ${step >= 3 ? 'is-in' : ''}`}>
                    V3
                </div>
                <div
                    className={`v3-welcome-rule ${step >= 3 ? 'is-in' : ''}`}
                    aria-hidden="true"
                />
                <p
                    className={`v3-welcome-cursive ${step >= 4 ? 'is-in' : ''}`}
                >
                    {CURSIVE_CHARS.map((char, index) => (
                        <span
                            key={index}
                            className={
                                char === ' '
                                    ? 'v3-welcome-space'
                                    : 'v3-welcome-letter' +
                                      (isPreciousLetter(index)
                                          ? ' is-precious'
                                          : '') +
                                      (index < dropped ? ' is-dropped' : '')
                            }
                        >
                            {char === ' ' ? '\u00a0' : char}
                        </span>
                    ))}
                </p>
                <p className={`v3-welcome-sub ${step >= 5 ? 'is-in' : ''}`}>
                    {SUBTITLE}
                </p>
                <button
                    type="button"
                    className={`v3-welcome-enter ${step >= 6 ? 'is-in' : ''}`}
                    onClick={(event) => {
                        event.stopPropagation()
                        dismiss()
                    }}
                >
                    Entrer
                </button>
            </div>
        </div>
    )
}
