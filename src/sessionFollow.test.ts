import {
    cardCrossTone,
    countRecentCrossesForSlot,
    countSessionCrosses,
    normalizeSessionFollow,
    sessionSummaryItems,
    sessionSummaryVisibleItems,
    sessionWindowStart,
} from './sessionFollow'

describe('normalizeSessionFollow', () => {
    it('accepte les durées connues et retombe sur 2 h', () => {
        expect(normalizeSessionFollow('30')).toBe('30')
        expect(normalizeSessionFollow('60')).toBe('60')
        expect(normalizeSessionFollow('120')).toBe('120')
        expect(normalizeSessionFollow('180')).toBe('180')
        expect(normalizeSessionFollow('day')).toBe('day')
        expect(normalizeSessionFollow(60)).toBe('60')
        expect(normalizeSessionFollow('nope')).toBe('120')
        expect(normalizeSessionFollow(undefined)).toBe('120')
    })
})

describe('sessionWindowStart', () => {
    it('recule de 120 minutes', () => {
        const now = new Date(2026, 8, 8, 14, 0, 0)
        const start = sessionWindowStart(now, '120')
        expect(start.getTime()).toBe(new Date(2026, 8, 8, 12, 0, 0).getTime())
    })

    it('recule de 30 minutes', () => {
        const now = new Date(2026, 8, 8, 14, 0, 0)
        const start = sessionWindowStart(now, '30')
        expect(start.getTime()).toBe(new Date(2026, 8, 8, 13, 30, 0).getTime())
    })

    it('prend minuit local pour la journée', () => {
        const now = new Date(2026, 8, 8, 14, 30, 0)
        const start = sessionWindowStart(now, 'day')
        expect(start.getFullYear()).toBe(2026)
        expect(start.getMonth()).toBe(8)
        expect(start.getDate()).toBe(8)
        expect(start.getHours()).toBe(0)
        expect(start.getMinutes()).toBe(0)
        expect(start.getSeconds()).toBe(0)
    })
})

describe('countSessionCrosses', () => {
    const windowStart = new Date(2026, 8, 8, 12, 0, 0)
    const iconMap = { behaviour: 1, homework: 2, supply: 3, phone: 8 }

    it('agrège par logo, y compris les anciennes croix sans champ icon', () => {
        const counts = countSessionCrosses(
            [
                { type: 'behaviour', time: new Date(2026, 8, 8, 13, 0, 0) },
                { type: 'behaviour', time: new Date(2026, 8, 8, 13, 30, 0) },
                { type: 'homework', time: new Date(2026, 8, 8, 12, 0, 0) },
                { type: 'supply', time: new Date(2026, 8, 8, 11, 59, 0) },
                { type: 'observation' },
                { time: new Date(2026, 8, 8, 13, 0, 0) },
                {
                    icon: 1,
                    polarity: 'negative',
                    time: new Date(2026, 8, 8, 13, 10, 0),
                },
            ],
            windowStart,
            iconMap
        )
        expect(counts).toEqual({
            'negative:1': 3,
            'negative:2': 1,
        })
    })

    it('lit un Timestamp Firestore via toDate', () => {
        const counts = countSessionCrosses(
            [
                {
                    type: 'phone',
                    time: { toDate: () => new Date(2026, 8, 8, 12, 1, 0) },
                },
            ],
            windowStart,
            iconMap
        )
        expect(counts['negative:8']).toBe(1)
    })
})

describe('countRecentCrossesForSlot', () => {
    const windowStart = new Date(2026, 8, 8, 12, 0, 0)
    const iconMap = { behaviour: 1, homework: 2 }

    it('ne compte que le logo demandé dans la fenêtre', () => {
        const crosses = [
            { type: 'behaviour', time: new Date(2026, 8, 8, 13, 0, 0) },
            { type: 'behaviour', time: new Date(2026, 8, 8, 11, 0, 0) },
            { type: 'homework', time: new Date(2026, 8, 8, 13, 0, 0) },
        ]
        expect(
            countRecentCrossesForSlot(
                crosses,
                { icon: 1, polarity: 'negative' },
                windowStart,
                iconMap
            )
        ).toBe(1)
        expect(
            countRecentCrossesForSlot(
                crosses,
                { icon: 2, polarity: 'negative' },
                windowStart,
                iconMap
            )
        ).toBe(1)
        expect(
            countRecentCrossesForSlot(
                crosses,
                { icon: 3, polarity: 'negative' },
                windowStart,
                iconMap
            )
        ).toBe(0)
    })
})

describe('sessionSummaryItems', () => {
    const slots = [
        { type: 'behaviour', icon: 15, polarity: 'negative' as const },
        { type: 'homework', icon: 20, polarity: 'negative' as const },
        { type: 'supply', icon: 13, polarity: 'negative' as const },
    ]

    it('garde l’ordre des logos et les totaux de séance', () => {
        const items = sessionSummaryItems(
            { 'negative:15': 1, 'negative:20': 3 },
            slots
        )
        expect(items).toEqual([
            {
                type: 'negative:15',
                icon: 15,
                polarity: 'negative',
                count: 1,
            },
            {
                type: 'negative:20',
                icon: 20,
                polarity: 'negative',
                count: 3,
            },
            {
                type: 'negative:13',
                icon: 13,
                polarity: 'negative',
                count: 0,
            },
        ])
    })

    it('ajoute à la fin un logo hors config s’il a des croix', () => {
        const items = sessionSummaryItems({ 'negative:8': 2 }, slots)
        expect(items[items.length - 1]).toEqual({
            type: 'negative:8',
            icon: 8,
            polarity: 'negative',
            count: 2,
        })
    })

    it('ne garde que les logos avec au moins une croix', () => {
        expect(
            sessionSummaryVisibleItems(
                sessionSummaryItems(
                    { 'negative:15': 1, 'negative:20': 0 },
                    slots
                )
            )
        ).toEqual([
            {
                type: 'negative:15',
                icon: 15,
                polarity: 'negative',
                count: 1,
            },
        ])
        expect(
            sessionSummaryVisibleItems(
                sessionSummaryItems({ 'negative:15': 0 }, slots)
            )
        ).toEqual([])
    })
})

describe('cardCrossTone', () => {
    it('met le nombre en rouge dès 1 croix récente, gras dès 2', () => {
        expect(cardCrossTone(0)).toEqual({ recent: false, bold: false })
        expect(cardCrossTone(1)).toEqual({ recent: true, bold: false })
        expect(cardCrossTone(2)).toEqual({ recent: true, bold: true })
    })
})
