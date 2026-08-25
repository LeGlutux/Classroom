import React, { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

type Platform = 'ios-safari' | 'ios-other' | 'android' | 'desktop'

let deferredPrompt: BeforeInstallPromptEvent | null = null
let openSheet: ((alreadyInstalled: boolean) => void) | null = null
const promptListeners: Array<() => void> = []

const notifyPrompt = () => {
    promptListeners.forEach((listener) => listener())
}

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

const isBraveBrowser = () => {
    const nav = window.navigator as Navigator & { brave?: { isBrave?: unknown } }
    return !!(nav.brave && nav.brave.isBrave)
}

const isPwaAlreadyInstalled = async () => {
    if (isStandaloneApp()) return true
    const nav = window.navigator as Navigator & {
        getInstalledRelatedApps?: () => Promise<Array<{ platform?: string }>>
    }
    if (typeof nav.getInstalledRelatedApps !== 'function') return false
    try {
        const apps = await nav.getInstalledRelatedApps()
        return Array.isArray(apps) && apps.length > 0
    } catch (error) {
        return false
    }
}

const launchNativePrompt = async () => {
    if (!deferredPrompt) return false
    const promptEvent = deferredPrompt
    deferredPrompt = null
    notifyPrompt()
    await promptEvent.prompt()
    await promptEvent.userChoice
    return true
}

export const listenForInstallPrompt = () => {
    if (typeof window === 'undefined') return
    window.addEventListener('beforeinstallprompt', (event) => {
        event.preventDefault()
        deferredPrompt = event as BeforeInstallPromptEvent
        notifyPrompt()
    })
    window.addEventListener('appinstalled', () => {
        deferredPrompt = null
        notifyPrompt()
    })
}

export const openInstallApp = async () => {
    if (deferredPrompt) {
        try {
            await launchNativePrompt()
            return
        } catch (error) {
            // Fall through to the instructions sheet.
        }
    }
    const alreadyInstalled = await isPwaAlreadyInstalled()
    if (openSheet) openSheet(alreadyInstalled)
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

const sheetCopy = (
    platform: Platform,
    alreadyInstalled: boolean,
    brave: boolean
) => {
    if (alreadyInstalled) {
        return {
            title: 'Déjà installée',
            body:
                'Thòt Note est déjà sur cet appareil (écran d’accueil ou liste d’apps). Chrome et Brave ne relancent pas le téléchargement tant que cette icône est là. Pour revoir le menu automatique, désinstalle l’app, puis reviens ici.',
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
            body: brave
                ? 'Brave n’ouvre pas toujours le menu tout seul. Tu peux installer depuis le navigateur :'
                : 'Le menu automatique n’est pas encore prêt (souvent au premier chargement, ou si l’app est déjà installée). Tu peux aussi le faire à la main :',
            steps: [
                brave
                    ? 'Appuie sur le menu (⋮) de Brave.'
                    : 'Appuie sur le menu (⋮) en haut à droite de Chrome.',
                'Choisis « Installer l’application » ou « Ajouter à l’écran d’accueil ».',
                'Si tu vois seulement « Créer un raccourci », c’est que l’app est déjà installée : cherche Thòt Note dans tes applications.',
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
    const [alreadyInstalled, setAlreadyInstalled] = useState(false)
    const [brave, setBrave] = useState(false)
    const [canPrompt, setCanPrompt] = useState(false)

    useEffect(() => {
        openSheet = (installed: boolean) => {
            setPlatform(detectPlatform())
            setAlreadyInstalled(installed)
            setBrave(isBraveBrowser())
            setCanPrompt(!!deferredPrompt)
            setOpen(true)
        }
        const onPrompt = () => setCanPrompt(!!deferredPrompt)
        promptListeners.push(onPrompt)
        return () => {
            openSheet = null
            const index = promptListeners.indexOf(onPrompt)
            if (index !== -1) promptListeners.splice(index, 1)
        }
    }, [])

    if (!open) return null

    const copy = sheetCopy(platform, alreadyInstalled, brave)
    const showNativeButton = canPrompt && !alreadyInstalled

    return (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
            <div
                className="modal-card install-card"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="modal-empty">{copy.title}</div>
                <div className="modal-sub">{copy.body}</div>
                {platform === 'ios-safari' && !alreadyInstalled ? (
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
                    {showNativeButton ? (
                        <button
                            type="button"
                            className="modal-btn modal-btn-primary"
                            onClick={async () => {
                                try {
                                    const launched = await launchNativePrompt()
                                    if (launched) setOpen(false)
                                } catch (error) {
                                    setCanPrompt(false)
                                }
                            }}
                        >
                            Installer
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="modal-btn modal-btn-primary"
                            onClick={() => setOpen(false)}
                        >
                            OK
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default InstallAppHost
