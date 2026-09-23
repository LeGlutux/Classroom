import { CrossPolarity, handleIcon, isPositiveCross } from '../functions'
import { crossMatchesSlot, LegacyIconMap } from '../crossIdentity'

type CrossDoc = {
    type?: string
    polarity?: string
    icon?: number
    [key: string]: unknown
}

type SlotInput = {
    type: string
    icon: number
    polarity: CrossPolarity
}

export type SlotCount = {
    type: string
    icon: number
    polarity: CrossPolarity
    src: string
    count: number
}

export type SlotDelta = SlotCount & {
    previous: number
    delta: number
}

export type ClassCrossStats = {
    studentCount: number
    total: number
    negatives: number
    positives: number
    bySlot: SlotCount[]
    zeroNegatives: number
    dominant: SlotCount | null
}

export const computeClassCrossStats = (
    docsByStudent: CrossDoc[][],
    slots: SlotInput[],
    iconMap?: LegacyIconMap
): ClassCrossStats => {
    let negatives = 0
    let positives = 0
    let zeroNegatives = 0
    const counts: { [type: string]: number } = {}
    slots.forEach((slot) => {
        counts[slot.type] = 0
    })

    docsByStudent.forEach((docs) => {
        let studentNeg = 0
        docs.forEach((doc) => {
            if (isPositiveCross(doc)) positives += 1
            else {
                negatives += 1
                studentNeg += 1
            }
            slots.forEach((slot) => {
                if (crossMatchesSlot(doc, slot, iconMap)) {
                    counts[slot.type] = (counts[slot.type] || 0) + 1
                }
            })
        })
        if (studentNeg === 0) zeroNegatives += 1
    })

    const bySlot = slots.map((slot) => ({
        type: slot.type,
        icon: slot.icon,
        polarity: slot.polarity,
        src: handleIcon(slot.icon),
        count: counts[slot.type] || 0,
    }))

    return {
        studentCount: docsByStudent.length,
        total: negatives + positives,
        negatives,
        positives,
        zeroNegatives,
        bySlot,
        dominant: findDominantSlot(bySlot),
    }
}

export const findDominantSlot = (bySlot: SlotCount[]): SlotCount | null => {
    let best: SlotCount | null = null
    bySlot.forEach((slot) => {
        if (slot.count <= 0) return
        if (!best || slot.count > best.count) best = slot
    })
    return best
}

export const diffSlotCounts = (
    current: SlotCount[],
    previous: SlotCount[]
): SlotDelta[] => {
    const prevByType: { [type: string]: number } = {}
    previous.forEach((slot) => {
        prevByType[slot.type] = slot.count
    })
    return current.map((slot) => {
        const prev = prevByType[slot.type] || 0
        return {
            ...slot,
            previous: prev,
            delta: slot.count - prev,
        }
    })
}

export const formatDelta = (delta: number) => {
    if (delta > 0) return '+' + delta
    return String(delta)
}

export const previousPeriodNumber = (
    selectedPeriod: number,
    periodCount: number,
    yearSentinel: number
) => {
    if (selectedPeriod === yearSentinel) return null
    if (selectedPeriod <= 1) return null
    if (selectedPeriod > periodCount) return null
    return selectedPeriod - 1
}
