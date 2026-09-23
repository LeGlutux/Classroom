import { isNativeApp, markNativeShell, syncKeyboardInset } from './native'

describe('isNativeApp', () => {
    const original = (window as any).Capacitor

    afterEach(() => {
        if (original === undefined) delete (window as any).Capacitor
        else (window as any).Capacitor = original
        document.documentElement.classList.remove('is-native-app')
        document.documentElement.classList.remove('keyboard-open')
        document.documentElement.style.removeProperty('--keyboard-inset')
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

    it('laisse de la place pour le clavier natif', () => {
        document.documentElement.classList.add('is-native-app')
        const previousHeight = Object.getOwnPropertyDescriptor(
            window,
            'innerHeight'
        )
        const previousViewport = (window as any).visualViewport
        Object.defineProperty(window, 'innerHeight', {
            configurable: true,
            value: 800,
        })
        ;(window as any).visualViewport = { height: 390, offsetTop: 0 }
        syncKeyboardInset()
        // jsdom (CRA) n’applique pas setProperty('--…') ; la classe suffit.
        expect(document.documentElement.classList.contains('keyboard-open')).toBe(
            true
        )
        if (previousHeight)
            Object.defineProperty(window, 'innerHeight', previousHeight)
        else delete (window as any).innerHeight
        if (previousViewport === undefined)
            delete (window as any).visualViewport
        else (window as any).visualViewport = previousViewport
        document.documentElement.classList.remove('keyboard-open')
        document.documentElement.style.removeProperty('--keyboard-inset')
    })
})
