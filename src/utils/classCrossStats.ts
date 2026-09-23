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

export type ClassCrossStats = {
    studentCount: number
    total: number
    negatives: number
    positives: number
    bySlot: SlotCount[]
    zeroNegatives: number
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

    return {
        studentCount: docsByStudent.length,
        total: negatives + positives,
        negatives,
        positives,
        zeroNegatives,
        bySlot: slots.map((slot) => ({
            type: slot.type,
            icon: slot.icon,
            polarity: slot.polarity,
            src: handleIcon(slot.icon),
            count: counts[slot.type] || 0,
        })),
    }
}
