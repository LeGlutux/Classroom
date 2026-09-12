import { isNativeApp, markNativeShell } from './native'

describe('isNativeApp', () => {
    const original = (window as any).Capacitor

    afterEach(() => {
        if (original === undefined) delete (window as any).Capacitor
        else (window as any).Capacitor = original
        document.documentElement.classList.remove('is-native-app')
    })

    it('est faux dans le navigateur', () => {
        delete (window as any).Capacitor
        expect(isNativeApp()).toBe(false)
    })

    it('est vrai dans la coquille Capacitor', () => {
        ;(window as any).Capacitor = { isNativePlatform: () => true }
        expect(isNativeApp()).toBe(true)
    })

    it('est faux si Capacitor dit rester sur le web', () => {
        ;(window as any).Capacitor = { isNativePlatform: () => false }
        expect(isNativeApp()).toBe(false)
    })

    it('marque le html pour le CSS des encoches', () => {
        ;(window as any).Capacitor = { isNativePlatform: () => true }
        markNativeShell()
        expect(document.documentElement.classList.contains('is-native-app')).toBe(
            true
        )
    })

    it('bloque le menu contextuel du WebView', () => {
        ;(window as any).Capacitor = { isNativePlatform: () => true }
        markNativeShell()
        const event = new MouseEvent('contextmenu', {
            bubbles: true,
            cancelable: true,
        })
        document.dispatchEvent(event)
        expect(event.defaultPrevented).toBe(true)
    })
})
