import React, { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

type Platform = 'ios-safari' | 'ios-other' | 'android' | 'desktop'

let deferredPrompt: BeforeInstallPromptEvent | null = null
let openSheet: (() => void) | null = null

const isStandaloneApp = () => {
    if (typeof window === 'undefined') return false
    const nav = window.navigator as Navigator & { standalone?: boolean }
    if (nav.standalone) return true
    return (
        window.matchMedia &&
        window.matchMedia('(display-mode: standalone)').matches
    )
}

const detectPlatform = (): Platform => {
    const ua = window.navigator.userAgent || ''
    const isIPadOS =
        window.navigator.platform === 'MacIntel' &&
        window.navigator.maxTouchPoints > 1
    const isIOS = /iPhone|iPad|iPod/i.test(ua) || isIPadOS
    if (isIOS) {
        const isSafari =
            /Safari/i.test(ua) &&
            !/CriOS|FxiOS|EdgiOS|OPiOS|DuckDuckGo/i.test(ua)
        return isSafari ? 'ios-safari' : 'ios-other'
    }
    if (/Android/i.test(ua)) return 'android'
    return 'desktop'
}

export const listenForInstallPrompt = () => {
    if (typeof window === 'undefined') return
    window.addEventListener('beforeinstallprompt', (event) => {
        event.preventDefault()
        deferredPrompt = event as BeforeInstallPromptEvent
    })
    window.addEventListener('appinstalled', () => {
        deferredPrompt = null
    })
}

export const openInstallApp = async () => {
    if (isStandaloneApp()) {
        if (openSheet) openSheet()
        return
    }
    if (deferredPrompt) {
        const promptEvent = deferredPrompt
        deferredPrompt = null
        try {
            await promptEvent.prompt()
            await promptEvent.userChoice
            return
        } catch (error) {
            // The native prompt needs a direct tap. Show the steps instead.
        }
    }
    if (openSheet) openSheet()
}

const ShareIcon = () => (
    <svg
        className="install-share-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <path d="M8 9H6.8A1.8 1.8 0 0 0 5 10.8v8.4A1.8 1.8 0 0 0 6.8 21h10.4a1.8 1.8 0 0 0 1.8-1.8v-8.4A1.8 1.8 0 0 0 17.2 9H16" />
        <path d="M12 14V3" />
        <path d="M8.5 6.5L12 3l3.5 3.5" />
    </svg>
)

const sheetCopy = (platform: Platform, standalone: boolean) => {
    if (standalone) {
        return {
            title: 'Déjà sur l’écran d’accueil',
            body:
                'Thòt Note est ouverte comme une app sur cet appareil. Rien de plus à installer.',
            steps: [] as string[],
        }
    }
    if (platform === 'ios-safari') {
        return {
            title: 'Ajouter à l’écran d’accueil',
            body:
                'Sur iPhone et iPad, Apple n’autorise pas l’installation en un clic. Deux gestes suffisent :',
            steps: [
                'Appuie sur le bouton Partager, en bas au milieu de Safari.',
                'Choisis « Sur l’écran d’accueil » (ou « Add to Home Screen »).',
                'Valide avec « Ajouter ». L’icône Thòt Note apparaît alors comme une app.',
            ],
        }
    }
    if (platform === 'ios-other') {
        return {
            title: 'Ouvre le site dans Safari',
            body:
                'Sur iPhone, l’ajout à l’écran d’accueil ne marche que dans Safari, pas dans Chrome ou Firefox.',
            steps: [
                'Copie l’adresse thotnote.org.',
                'Colle-la dans Safari.',
                'Puis Partager → Sur l’écran d’accueil → Ajouter.',
            ],
        }
    }
    if (platform === 'android') {
        return {
            title: 'Installer l’app',
            body:
                'Si le menu d’installation ne s’est pas ouvert tout seul, tu peux le faire depuis le navigateur :',
            steps: [
                'Appuie sur le menu (⋮) en haut à droite.',
                'Choisis « Installer l’application » ou « Ajouter à l’écran d’accueil ».',
                'Valide. Thòt Note s’ouvre ensuite comme une app, sans barre d’adresse.',
            ],
        }
    }
    return {
        title: 'Installer l’app',
        body:
            'Sur ordinateur, l’installation marche le mieux avec Chrome ou Edge. Tu peux aussi l’ajouter depuis le menu du navigateur.',
        steps: [
            'Dans Chrome ou Edge, ouvre le menu (⋮).',
            'Choisis « Installer Thòt Note » ou « Applications » → « Installer cette application ».',
            'Sur iPhone, ouvre plutôt le site dans Safari, puis Partager → Sur l’écran d’accueil.',
        ],
    }
}

export const InstallAppHost = () => {
    const [open, setOpen] = useState(false)
    const [platform, setPlatform] = useState<Platform>('desktop')
    const [standalone, setStandalone] = useState(false)

    useEffect(() => {
        openSheet = () => {
            setPlatform(detectPlatform())
            setStandalone(isStandaloneApp())
            setOpen(true)
        }
        return () => {
            openSheet = null
        }
    }, [])

    if (!open) return null

    const copy = sheetCopy(platform, standalone)

    return (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
            <div
                className="modal-card install-card"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="modal-empty">{copy.title}</div>
                <div className="modal-sub">{copy.body}</div>
                {platform === 'ios-safari' && !standalone ? (
                    <div className="install-share-hint">
                        <ShareIcon />
                        <span>C’est cette icône Partager, en bas de Safari.</span>
                    </div>
                ) : null}
                {copy.steps.length ? (
                    <ol className="install-steps">
                        {copy.steps.map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ol>
                ) : null}
                <div className="modal-actions">
                    <button
                        type="button"
                        className="modal-btn modal-btn-primary"
                        onClick={() => setOpen(false)}
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    )
}

export default InstallAppHost
