let locks = 0
let attached = false

const onTouchMove = (event: TouchEvent) => {
    if (locks > 0) event.preventDefault()
}

export const lockPageTouch = () => {
    if (typeof document === 'undefined') return
    if (!attached) {
        document.addEventListener('touchmove', onTouchMove, { passive: false })
        attached = true
    }
    locks += 1
}

export const unlockPageTouch = () => {
    locks = Math.max(0, locks - 1)
}
