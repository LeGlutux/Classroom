type CapacitorBridge = {
    isNativePlatform?: () => boolean
}

const getCapacitor = (): CapacitorBridge | undefined => {
    if (typeof window === 'undefined') return undefined
    return (window as Window & { Capacitor?: CapacitorBridge }).Capacitor
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

export const markNativeShell = () => {
    if (typeof document === 'undefined' || !isNativeApp()) return
    document.documentElement.classList.add('is-native-app')
    if (contextMenuBlocked) return
    contextMenuBlocked = true
    document.addEventListener('contextmenu', (event) => {
        event.preventDefault()
    })
}
