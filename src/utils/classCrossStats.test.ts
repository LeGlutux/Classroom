import {
    computeClassCrossStats,
    diffSlotCounts,
    findDominantSlot,
    formatDelta,
    previousPeriodNumber,
} from './classCrossStats'

describe('computeClassCrossStats', () => {
    const slots = [
        { type: 'homework', icon: 1, polarity: 'negative' as const },
        { type: 'behaviour', icon: 2, polarity: 'negative' as const },
        { type: 'pos0', icon: 10, polarity: 'positive' as const },
    ]

    it('agrège totaux, comptes par type et type dominant', () => {
        const stats = computeClassCrossStats(
            [
                [
                    { type: 'homework', polarity: 'negative', icon: 1 },
                    { type: 'homework', polarity: 'negative', icon: 1 },
                    { type: 'pos0', polarity: 'positive', icon: 10 },
                ],
                [{ type: 'behaviour', polarity: 'negative', icon: 2 }],
                [],
            ],
            slots
        )
        expect(stats.studentCount).toBe(3)
        expect(stats.negatives).toBe(3)
        expect(stats.positives).toBe(1)
        expect(stats.total).toBe(4)
        expect(stats.zeroNegatives).toBe(1)
        expect(stats.bySlot.map((s) => [s.type, s.count])).toEqual([
            ['homework', 2],
            ['behaviour', 1],
            ['pos0', 1],
        ])
        expect(stats.dominant && stats.dominant.type).toBe('homework')
        expect(stats.dominant && stats.dominant.count).toBe(2)
    })
})

describe('findDominantSlot', () => {
    it('ignore les comptes à zéro', () => {
        expect(
            findDominantSlot([
                {
                    type: 'a',
                    icon: 1,
                    polarity: 'negative',
                    src: 'none',
                    count: 0,
                },
            ])
        ).toBeNull()
    })
})

describe('diffSlotCounts', () => {
    it('calcule le delta par type', () => {
        const current = [
            {
                type: 'homework',
                icon: 1,
                polarity: 'negative' as const,
                src: 'x',
                count: 5,
            },
            {
                type: 'pos0',
                icon: 10,
                polarity: 'positive' as const,
                src: 'y',
                count: 1,
            },
        ]
        const previous = [
            {
                type: 'homework',
                icon: 1,
                polarity: 'negative' as const,
                src: 'x',
                count: 3,
            },
            {
                type: 'pos0',
                icon: 10,
                polarity: 'positive' as const,
                src: 'y',
                count: 2,
            },
        ]
        const diff = diffSlotCounts(current, previous)
        expect(diff.map((d) => [d.type, d.delta, formatDelta(d.delta)])).toEqual(
            [
                ['homework', 2, '+2'],
                ['pos0', -1, '-1'],
            ]
        )
    })
})

describe('previousPeriodNumber', () => {
    it('renvoie la période précédente ou null', () => {
        expect(previousPeriodNumber(3, 4, 0)).toBe(2)
        expect(previousPeriodNumber(1, 4, 0)).toBeNull()
        expect(previousPeriodNumber(0, 4, 0)).toBeNull()
    })
})
