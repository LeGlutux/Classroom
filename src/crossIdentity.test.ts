import {
    buildLegacyIconMap,
    crossMatchesSlot,
    defaultIconForType,
    parseLegacyIconMap,
    resolveCrossIcon,
    slotIdentity,
} from './crossIdentity'

describe('buildLegacyIconMap', () => {
    it('associe chaque ancien type au logo actuel de sa case', () => {
        expect(
            buildLegacyIconMap([15, 20, 3, 4, 0, 0], [16, 0, 0, 0, 0, 0])
        ).toEqual({
            behaviour: 15,
            homework: 20,
            supply: 3,
            observation: 4,
            pos0: 16,
        })
    })

    it('reprend le logo par défaut si la case a été vidée', () => {
        const map = buildLegacyIconMap([0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0])
        expect(map.behaviour).toBe(1)
        expect(map.homework).toBe(2)
        expect(map.supply).toBe(3)
        expect(map.observation).toBe(4)
        expect(map.pos0).toBeUndefined()
    })
})

describe('resolveCrossIcon', () => {
    const map = { homework: 20, behaviour: 15 }

    it('privilégie le logo déjà stocké sur la croix', () => {
        expect(
            resolveCrossIcon({ type: 'homework', icon: 8 }, map)
        ).toBe(8)
    })

    it('retombe sur la carte figée puis sur le défaut historique', () => {
        expect(resolveCrossIcon({ type: 'homework' }, map)).toBe(20)
        expect(resolveCrossIcon({ type: 'supply' }, map)).toBe(3)
        expect(defaultIconForType('homework')).toBe(2)
    })
})

describe('crossMatchesSlot', () => {
    const map = { homework: 2, behaviour: 1 }

    it('reconnaît une ancienne croix homework comme le sac à dos', () => {
        expect(
            crossMatchesSlot(
                { type: 'homework' },
                { icon: 2, polarity: 'negative' },
                map
            )
        ).toBe(true)
        expect(
            crossMatchesSlot(
                { type: 'homework', icon: 8 },
                { icon: 2, polarity: 'negative' },
                map
            )
        ).toBe(false)
        expect(
            crossMatchesSlot(
                { type: 'homework', icon: 8 },
                { icon: 8, polarity: 'negative' },
                map
            )
        ).toBe(true)
    })

    it('sépare positif et négatif même logo', () => {
        expect(
            crossMatchesSlot(
                { icon: 16, polarity: 'positive' },
                { icon: 16, polarity: 'negative' },
                map
            )
        ).toBe(false)
        expect(slotIdentity('positive', 16)).toBe('positive:16')
    })
})

describe('parseLegacyIconMap', () => {
    it('ignore une carte vide ou invalide', () => {
        expect(parseLegacyIconMap(null)).toBeNull()
        expect(parseLegacyIconMap({})).toBeNull()
        expect(parseLegacyIconMap({ homework: 20 }).homework).toBe(20)
    })
})
