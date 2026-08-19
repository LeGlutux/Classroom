

import alarm_clock from './images/Icons/alarm_clock.png'
import backpack from './images/Icons/backpack.png'
import book from './images/Icons/book.png'
import calculator from './images/Icons/calculator.png'
import checkmark from './images/Icons/checkmark.png'
import old_phone from './images/Icons/old_phone.png'
import pen from './images/Icons/pen.png'
import phone from './images/Icons/phone.png'
import plus from './images/Icons/plus.png'
import signature from './images/Icons/signature.png'
import smiley from './images/Icons/smiley.png'
import stop from './images/Icons/stop.png'
import supply from './images/Icons/supply.png'
import supply2 from './images/Icons/supply2.png'
import thumbs_down from './images/Icons/thumbs_down.png'
import thumbs_up from './images/Icons/thumbs_up.png'
import timer from './images/Icons/timer.png'
import warning from './images/Icons/warning.png'
import help from './images/Icons/help.png'
import homework from './images/Icons/homework.png'

export const maxValue = 20

export const handleIcon = (iconNumber: number) => {
    if (iconNumber === 1) return alarm_clock
    if (iconNumber === 2) return backpack
    if (iconNumber === 3) return book
    if (iconNumber === 4) return calculator
    if (iconNumber === 5) return checkmark
    if (iconNumber === 6) return old_phone
    if (iconNumber === 7) return pen
    if (iconNumber === 8) return phone
    if (iconNumber === 9) return plus
    if (iconNumber === 10) return signature
    if (iconNumber === 11) return smiley
    if (iconNumber === 12) return stop
    if (iconNumber === 13) return supply
    if (iconNumber === 14) return supply2
    if (iconNumber === 15) return thumbs_down
    if (iconNumber === 16) return thumbs_up
    if (iconNumber === 17) return timer
    if (iconNumber === 18) return warning
    if (iconNumber === 19) return help
    if (iconNumber === 20) return homework
    else return 'none'
}

export const DEFAULT_NEGATIVE_ICONS = [1, 2, 3, 4, 0, 0]
export const DEFAULT_POSITIVE_ICONS = [0, 0, 0, 0, 0, 0]
export const MAX_CROSS_ICONS = 6
export const NEGATIVE_CROSS_TYPES = [
    'behaviour',
    'homework',
    'supply',
    'observation',
    'calculator',
    'phone',
]
export const POSITIVE_CROSS_TYPES = [
    'pos0',
    'pos1',
    'pos2',
    'pos3',
    'pos4',
    'pos5',
]

export type CrossPolarity = 'negative' | 'positive'

export type CrossSlot = {
    icon: number
    type: string
    polarity: CrossPolarity
}

export const padIconList = (icons: unknown, fallback: number[]): number[] => {
    const source = Array.isArray(icons) ? icons : fallback
    return [0, 1, 2, 3, 4, 5].map((i) => {
        const n = Number(source[i])
        return Number.isFinite(n) ? n : 0
    })
}

export const activeIconCount = (icons: number[]) =>
    icons.filter((n) => n !== 0).length

export const buildCrossSlots = (
    negative: number[],
    positive: number[]
): CrossSlot[] => {
    const slots: CrossSlot[] = []
    padIconList(negative, DEFAULT_NEGATIVE_ICONS).forEach((icon, i) => {
        if (icon !== 0) {
            slots.push({
                icon,
                type: NEGATIVE_CROSS_TYPES[i],
                polarity: 'negative',
            })
        }
    })
    padIconList(positive, DEFAULT_POSITIVE_ICONS).forEach((icon, i) => {
        if (icon !== 0) {
            slots.push({
                icon,
                type: POSITIVE_CROSS_TYPES[i],
                polarity: 'positive',
            })
        }
    })
    return slots.slice(0, MAX_CROSS_ICONS)
}

export const isPositiveCross = (
    cross: { type?: string; polarity?: string }
) => {
    if (cross.polarity === 'positive') return true
    if (cross.polarity === 'negative') return false
    return POSITIVE_CROSS_TYPES.indexOf(cross.type || '') !== -1
}

export const studentInClass = (
    student: { classes?: string | string[] },
    group: string
) => {
    const classes = student.classes
    if (Array.isArray(classes)) return classes.indexOf(group) !== -1
    return classes === group
}

export const crossTimeValue = (element: { time?: any }) => {
    if (!element || !element.time) return 0
    if (element.time.toDate) return element.time.toDate().getTime()
    if (element.time.getTime) return element.time.getTime()
    const parsed = new Date(element.time).getTime()
    return Number.isFinite(parsed) ? parsed : 0
}

export const ADMIN_UID = 'yp8DVglUprVCqM8mTmnoZ8cr2yJ3'
export const ADMIN_EMAIL = 'lp.bendeks@gmail.com'

export const isAdminUser = (user?: {
    uid?: string
    email?: string | null
} | null) => {
    if (!user) return false
    if (user.uid === ADMIN_UID) return true
    return (user.email || '').toLowerCase() === ADMIN_EMAIL
}

export const formatDateTime = (value: any) => {
    if (!value) return '—'
    const date = value.toDate
        ? value.toDate()
        : value instanceof Date
        ? value
        : new Date(value)
    if (!date || Number.isNaN(date.getTime())) return '—'
    return (
        date.toLocaleDateString('fr-FR') +
        ' · ' +
        date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    )
}

export const crossInCurrentPeriod = (
    element: { time?: any },
    periodes: Date[],
    runningPeriode: number
) => {
    const t = crossTimeValue(element)
    if (!t || !periodes || periodes.length === 0) return false
    const current = Math.min(Math.max(runningPeriode, 1), periodes.length)
    if (current === periodes.length) {
        const start = periodes[current - 1]
        const startTime =
            start instanceof Date ? start.getTime() : new Date(start).getTime()
        return t > startTime
    }
    const start = periodes[current - 1]
    const end = periodes[current]
    if (!start || !end) return false
    const startTime =
        start instanceof Date ? start.getTime() : new Date(start).getTime()
    const endTime = end instanceof Date ? end.getTime() : new Date(end).getTime()
    return t > startTime && t < endTime
}