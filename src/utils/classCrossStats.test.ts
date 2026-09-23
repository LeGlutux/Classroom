import { computeClassCrossStats } from '../utils/classCrossStats'

describe('computeClassCrossStats', () => {
    const slots = [
        { type: 'homework', icon: 1, polarity: 'negative' as const },
        { type: 'behaviour', icon: 2, polarity: 'negative' as const },
        { type: 'pos0', icon: 10, polarity: 'positive' as const },
    ]

    it('agrège totaux et comptes par type', () => {
        const stats = computeClassCrossStats(
            [
                [
                    { type: 'homework', polarity: 'negative' },
                    { type: 'pos0', polarity: 'positive' },
                ],
                [{ type: 'behaviour', polarity: 'negative' }],
                [],
            ],
            slots
        )
        expect(stats.studentCount).toBe(3)
        expect(stats.negatives).toBe(2)
        expect(stats.positives).toBe(1)
        expect(stats.total).toBe(3)
        expect(stats.zeroNegatives).toBe(2)
        expect(stats.bySlot.map((s) => [s.type, s.count])).toEqual([
            ['homework', 1],
            ['behaviour', 1],
            ['pos0', 1],
        ])
    })
})
