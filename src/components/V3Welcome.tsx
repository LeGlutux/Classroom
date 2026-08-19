import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../Auth'

const STORAGE_KEY = 'thotnote.v3.welcome'
const CURSIVE = 'libère ta pédagogie.'
const SUBTITLE = 'Le plus célèbre cahier de note virtuel vous présente sa V3.'

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

export default () => {
    const { currentUser } = useContext(AuthContext)
    const [visible, setVisible] = useState(false)
    const [leaving, setLeaving] = useState(false)
    const [step, setStep] = useState(0)

    useEffect(() => {
        if (!currentUser || hasSeenWelcome()) return
        setVisible(true)
        if (prefersReducedMotion()) {
            setStep(5)
            return
        }
        const timers = [
            window.setTimeout(() => setStep(1), 700),
            window.setTimeout(() => setStep(2), 2400),
            window.setTimeout(() => setStep(3), 3700),
            window.setTimeout(() => setStep(4), 6400),
            window.setTimeout(() => setStep(5), 7600),
        ]
        return () => {
            timers.forEach((id) => window.clearTimeout(id))
        }
    }, [currentUser])

    const dismiss = () => {
        if (step < 4 || leaving) return
        setLeaving(true)
        window.setTimeout(() => {
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
            <div className="v3-welcome-inner">
                <div className={`v3-welcome-line ${step >= 1 ? 'is-in' : ''}`}>
                    Bienvenue sur Thòt Note
                </div>
                <div className={`v3-welcome-v3 ${step >= 2 ? 'is-in' : ''}`}>
                    V3
                </div>
                <div
                    className={`v3-welcome-rule ${step >= 2 ? 'is-in' : ''}`}
                    aria-hidden="true"
                />
                <p className={`v3-welcome-cursive ${step >= 3 ? 'is-in' : ''}`}>
                    {Array.from(CURSIVE).map((char, index) => (
                        <span
                            key={index}
                            className={
                                char === ' '
                                    ? 'v3-welcome-space'
                                    : 'v3-welcome-letter'
                            }
                            style={{ animationDelay: index * 0.09 + 's' }}
                        >
                            {char === ' ' ? '\u00a0' : char}
                        </span>
                    ))}
                </p>
                <p className={`v3-welcome-sub ${step >= 4 ? 'is-in' : ''}`}>
                    {SUBTITLE}
                </p>
                <button
                    type="button"
                    className={`v3-welcome-enter ${step >= 5 ? 'is-in' : ''}`}
                    onClick={dismiss}
                >
                    Entrer
                </button>
            </div>
        </div>
    )
}
