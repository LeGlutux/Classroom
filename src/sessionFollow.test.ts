import {
    cardCrossTone,
    countRecentCrossesOfType,
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

    it('ignore les croix trop anciennes et agrège par type', () => {
        const counts = countSessionCrosses(
            [
                { type: 'behaviour', time: new Date(2026, 8, 8, 13, 0, 0) },
                { type: 'behaviour', time: new Date(2026, 8, 8, 13, 30, 0) },
                { type: 'homework', time: new Date(2026, 8, 8, 12, 0, 0) },
                { type: 'supply', time: new Date(2026, 8, 8, 11, 59, 0) },
                { type: 'observation' },
                { time: new Date(2026, 8, 8, 13, 0, 0) },
            ],
            windowStart
        )
        expect(counts).toEqual({ behaviour: 2, homework: 1 })
    })

    it('lit un Timestamp Firestore via toDate', () => {
        const counts = countSessionCrosses(
            [
                {
                    type: 'phone',
                    time: { toDate: () => new Date(2026, 8, 8, 12, 1, 0) },
                },
            ],
            windowStart
        )
        expect(counts.phone).toBe(1)
    })
})

describe('countRecentCrossesOfType', () => {
    const windowStart = new Date(2026, 8, 8, 12, 0, 0)

    it('ne compte que le type demandé dans la fenêtre', () => {
        const crosses = [
            { type: 'behaviour', time: new Date(2026, 8, 8, 13, 0, 0) },
            { type: 'behaviour', time: new Date(2026, 8, 8, 11, 0, 0) },
            { type: 'homework', time: new Date(2026, 8, 8, 13, 0, 0) },
        ]
        expect(countRecentCrossesOfType(crosses, 'behaviour', windowStart)).toBe(
            1
        )
        expect(countRecentCrossesOfType(crosses, 'homework', windowStart)).toBe(
            1
        )
        expect(countRecentCrossesOfType(crosses, 'supply', windowStart)).toBe(0)
    })
})

describe('sessionSummaryItems', () => {
    const slots = [
        { type: 'behaviour', icon: 15 },
        { type: 'homework', icon: 20 },
        { type: 'supply', icon: 13 },
    ]

    it('garde l’ordre des logos et les totaux de séance', () => {
        const items = sessionSummaryItems(
            { behaviour: 1, homework: 3 },
            slots
        )
        expect(items).toEqual([
            { type: 'behaviour', icon: 15, count: 1 },
            { type: 'homework', icon: 20, count: 3 },
            { type: 'supply', icon: 13, count: 0 },
        ])
    })

    it('ajoute à la fin un type hors config s’il a des croix', () => {
        const items = sessionSummaryItems({ phone: 2 }, slots)
        expect(items[items.length - 1]).toEqual({
            type: 'phone',
            icon: 0,
            count: 2,
        })
    })

    it('ne garde que les logos avec au moins une croix', () => {
        expect(
            sessionSummaryVisibleItems(
                sessionSummaryItems({ behaviour: 1, homework: 0 }, slots)
            )
        ).toEqual([{ type: 'behaviour', icon: 15, count: 1 }])
        expect(
            sessionSummaryVisibleItems(
                sessionSummaryItems({ behaviour: 0 }, slots)
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
