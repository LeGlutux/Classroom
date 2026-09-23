type CapacitorBridge = {
    isNativePlatform?: () => boolean
}

type VisualViewportLike = {
    height: number
    offsetTop: number
    addEventListener: (
        type: string,
        listener: EventListenerOrEventListenerObject
    ) => void
}

const getCapacitor = (): CapacitorBridge | undefined => {
    if (typeof window === 'undefined') return undefined
    return (window as Window & { Capacitor?: CapacitorBridge }).Capacitor
}

const getVisualViewport = (): VisualViewportLike | undefined => {
    if (typeof window === 'undefined') return undefined
    return (window as Window & { visualViewport?: VisualViewportLike })
        .visualViewport
}

export const isNativeApp = () => {
    const cap = getCapacitor()
    if (!cap || typeof cap.isNativePlatform !== 'function') return false
    try {
        return cap.isNativePlatform() === true
    } catch (error) {
        return false
    }
}

let contextMenuBlocked = false
let keyboardTracked = false

export const syncKeyboardInset = () => {
    if (typeof document === 'undefined' || typeof window === 'undefined') return
    const root = document.documentElement
    if (!root.classList.contains('is-native-app')) return
    const viewport = getVisualViewport()
    const inset = viewport
        ? Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop)
        : 0
    root.style.setProperty('--keyboard-inset', Math.round(inset) + 'px')
    root.classList.toggle('keyboard-open', inset > 80)
}

const scrollFocusedFieldIntoView = () => {
    const el = document.activeElement
    if (!(el instanceof HTMLElement)) return
    const tag = el.tagName
    if (tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') return
    el.scrollIntoView({ block: 'center', inline: 'nearest' })
}

export const markNativeShell = () => {
    if (typeof document === 'undefined' || !isNativeApp()) return
    document.documentElement.classList.add('is-native-app')
    if (!contextMenuBlocked) {
        contextMenuBlocked = true
        document.addEventListener('contextmenu', (event) => {
            event.preventDefault()
        })
    }
    if (keyboardTracked) return
    keyboardTracked = true
    const viewport = getVisualViewport()
    if (viewport) {
        viewport.addEventListener('resize', syncKeyboardInset)
        viewport.addEventListener('scroll', syncKeyboardInset)
    }
    window.addEventListener('focusin', () => {
        syncKeyboardInset()
        window.setTimeout(scrollFocusedFieldIntoView, 350)
    })
    window.addEventListener('focusout', () => {
        window.setTimeout(syncKeyboardInset, 250)
    })
    syncKeyboardInset()
}
