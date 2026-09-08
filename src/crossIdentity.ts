import {
    CrossPolarity,
    CrossSlot,
    DEFAULT_NEGATIVE_ICONS,
    DEFAULT_POSITIVE_ICONS,
    NEGATIVE_CROSS_TYPES,
    POSITIVE_CROSS_TYPES,
    isPositiveCross,
    padIconList,
} from './functions'

export type CrossLike = {
    type?: string
    icon?: number
    polarity?: string
    time?: any
    id?: string
}

export type LegacyIconMap = { [type: string]: number }

export const slotIdentity = (
    polarity: CrossPolarity,
    icon: number
): string => polarity + ':' + String(icon)

export const slotIdentityOf = (slot: {
    polarity: CrossPolarity
    icon: number
}) => slotIdentity(slot.polarity, slot.icon)

export const parseLegacyIconMap = (raw: unknown): LegacyIconMap | null => {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null
    const source = raw as { [key: string]: unknown }
    const map: LegacyIconMap = {}
    let found = false
    Object.keys(source).forEach((type) => {
        const n = Number(source[type])
        if (!type || !Number.isFinite(n) || n <= 0) return
        map[type] = n
        found = true
    })
    return found ? map : null
}

export const buildLegacyIconMap = (
    negative: unknown,
    positive: unknown
): LegacyIconMap => {
    const map: LegacyIconMap = {}
    padIconList(negative, DEFAULT_NEGATIVE_ICONS).forEach((icon, i) => {
        const type = NEGATIVE_CROSS_TYPES[i]
        const fallback = DEFAULT_NEGATIVE_ICONS[i] || 0
        const value = icon || fallback
        if (type && value > 0) map[type] = value
    })
    padIconList(positive, DEFAULT_POSITIVE_ICONS).forEach((icon, i) => {
        const type = POSITIVE_CROSS_TYPES[i]
        const fallback = DEFAULT_POSITIVE_ICONS[i] || 0
        const value = icon || fallback
        if (type && value > 0) map[type] = value
    })
    return map
}

export const defaultIconForType = (type?: string): number => {
    if (!type) return 0
    const negativeIndex = NEGATIVE_CROSS_TYPES.indexOf(type)
    if (negativeIndex !== -1) return DEFAULT_NEGATIVE_ICONS[negativeIndex] || 0
    const positiveIndex = POSITIVE_CROSS_TYPES.indexOf(type)
    if (positiveIndex !== -1) return DEFAULT_POSITIVE_ICONS[positiveIndex] || 0
    return 0
}

export const resolveCrossIcon = (
    cross: CrossLike | null | undefined,
    iconMap?: LegacyIconMap | null
): number => {
    if (!cross) return 0
    const stored = Number(cross.icon)
    if (Number.isFinite(stored) && stored > 0) return stored
    const type = cross.type
    if (type && iconMap && iconMap[type] > 0) return iconMap[type]
    return defaultIconForType(type)
}

export const crossPolarityOf = (
    cross: CrossLike | null | undefined
): CrossPolarity => (isPositiveCross(cross || {}) ? 'positive' : 'negative')

export const crossMatchesSlot = (
    cross: CrossLike | null | undefined,
    slot: { icon: number; polarity: CrossPolarity },
    iconMap?: LegacyIconMap | null
) => {
    if (!cross || !slot || !slot.icon) return false
    if (crossPolarityOf(cross) !== slot.polarity) return false
    return resolveCrossIcon(cross, iconMap) === slot.icon
}

export const filterCrossesForSlot = <T extends CrossLike>(
    crosses: T[] | null | undefined,
    slot: { icon: number; polarity: CrossPolarity },
    iconMap?: LegacyIconMap | null
) => (crosses || []).filter((cross) => crossMatchesSlot(cross, slot, iconMap))

export const newCrossDocId = (icon: number, polarity: CrossPolarity) =>
    'i' +
    String(icon) +
    (polarity === 'positive' ? 'p' : 'n') +
    'c' +
    Date.now().toString()

export const withResolvedIcon = <T extends CrossLike>(
    cross: T,
    iconMap?: LegacyIconMap | null
): T => {
    const icon = resolveCrossIcon(cross, iconMap)
    if (!icon || cross.icon === icon) return cross
    return { ...cross, icon }
}
