import { CrossPolarity, crossTimeValue } from './functions'
import {
    LegacyIconMap,
    crossMatchesSlot,
    crossPolarityOf,
    resolveCrossIcon,
    slotIdentity,
    slotIdentityOf,
} from './crossIdentity'

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
    crosses: {
        type?: string
        icon?: number
        polarity?: string
        time?: any
    }[],
    windowStart: Date,
    iconMap?: LegacyIconMap | null
): { [key: string]: number } => {
    const startMs = windowStart.getTime()
    const counts: { [key: string]: number } = {}
    ;(crosses || []).forEach((cross) => {
        const icon = resolveCrossIcon(cross, iconMap)
        if (!icon) return
        const time = crossTimeValue(cross)
        if (!time || time < startMs) return
        const key = slotIdentity(crossPolarityOf(cross), icon)
        counts[key] = (counts[key] || 0) + 1
    })
    return counts
}

export type SessionSummaryItem = {
    type: string
    icon: number
    polarity: CrossPolarity
    count: number
}

export const sessionSummaryItems = (
    counts: { [key: string]: number },
    slots: { type: string; icon: number; polarity: CrossPolarity }[]
): SessionSummaryItem[] => {
    const seen: { [key: string]: boolean } = {}
    const items: SessionSummaryItem[] = []
    ;(slots || []).forEach((slot) => {
        if (!slot || !slot.icon) return
        const key = slotIdentityOf(slot)
        if (seen[key]) return
        seen[key] = true
        items.push({
            type: key,
            icon: slot.icon,
            polarity: slot.polarity,
            count: counts[key] || 0,
        })
    })
    Object.keys(counts || {}).forEach((key) => {
        if (seen[key]) return
        const count = counts[key] || 0
        if (count === 0) return
        const parts = key.split(':')
        const polarity = parts[0] === 'positive' ? 'positive' : 'negative'
        const icon = Number(parts[1]) || 0
        items.push({
            type: key,
            icon,
            polarity,
            count,
        })
    })
    return items
}

export const sessionSummaryVisibleItems = <T extends { count: number }>(
    items: T[]
) => items.filter((item) => item.count > 0)

export const countRecentCrossesForSlot = (
    crosses: {
        type?: string
        icon?: number
        polarity?: string
        time?: any
    }[],
    slot: { icon: number; polarity: CrossPolarity },
    windowStart: Date,
    iconMap?: LegacyIconMap | null
) => {
    const startMs = windowStart.getTime()
    let count = 0
    ;(crosses || []).forEach((cross) => {
        if (!crossMatchesSlot(cross, slot, iconMap)) return
        const time = crossTimeValue(cross)
        if (time && time >= startMs) count += 1
    })
    return count
}

export const cardCrossTone = (recentCount: number) => ({
    recent: recentCount >= 1,
    bold: recentCount >= 2,
})
