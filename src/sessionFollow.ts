import { crossTimeValue } from './functions'

export type SessionFollowMode = '30' | '60' | '120' | '180' | 'day'

export const SESSION_FOLLOW_DEFAULT: SessionFollowMode = '120'

export const SESSION_FOLLOW_OPTIONS: {
    value: SessionFollowMode
    label: string
    shortLabel: string
}[] = [
    { value: '30', label: '30 minutes', shortLabel: '30 min' },
    { value: '60', label: '1 heure', shortLabel: '1 h' },
    { value: '120', label: '2 heures', shortLabel: '2 h' },
    { value: '180', label: '3 heures', shortLabel: '3 h' },
    { value: 'day', label: 'Journée (minuit à minuit)', shortLabel: 'Journée' },
]

const FOLLOW_VALUES: { [key: string]: SessionFollowMode } = {
    '30': '30',
    '60': '60',
    '120': '120',
    '180': '180',
    day: 'day',
}

export const normalizeSessionFollow = (value: unknown): SessionFollowMode => {
    if (value === 30 || value === 60 || value === 120 || value === 180) {
        return String(value) as SessionFollowMode
    }
    if (typeof value === 'string' && FOLLOW_VALUES[value]) {
        return FOLLOW_VALUES[value]
    }
    return SESSION_FOLLOW_DEFAULT
}

export const sessionWindowStart = (
    now: Date,
    mode: SessionFollowMode
): Date => {
    if (mode === 'day') {
        const start = new Date(now.getTime())
        start.setHours(0, 0, 0, 0)
        return start
    }
    const minutes = parseInt(mode, 10)
    return new Date(now.getTime() - minutes * 60 * 1000)
}

export const countSessionCrosses = (
    crosses: { type?: string; time?: any }[],
    windowStart: Date
): { [type: string]: number } => {
    const startMs = windowStart.getTime()
    const counts: { [type: string]: number } = {}
    ;(crosses || []).forEach((cross) => {
        const type = cross && cross.type
        if (!type) return
        const time = crossTimeValue(cross)
        if (!time || time < startMs) return
        counts[type] = (counts[type] || 0) + 1
    })
    return counts
}

export type SessionSummaryItem = {
    type: string
    icon: number
    count: number
    recent: boolean
    bold: boolean
}

export const sessionSummaryItems = (
    counts: { [type: string]: number },
    slots: { type: string; icon: number }[]
): SessionSummaryItem[] => {
    const seen: { [type: string]: boolean } = {}
    const items: SessionSummaryItem[] = []
    ;(slots || []).forEach((slot) => {
        if (!slot || !slot.type) return
        const count = counts[slot.type] || 0
        seen[slot.type] = true
        items.push({
            type: slot.type,
            icon: slot.icon,
            count,
            recent: count >= 1,
            bold: count >= 2,
        })
    })
    Object.keys(counts || {}).forEach((type) => {
        if (seen[type]) return
        const count = counts[type] || 0
        if (count === 0) return
        items.push({
            type,
            icon: 0,
            count,
            recent: true,
            bold: count >= 2,
        })
    })
    return items
}
