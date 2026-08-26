import {
    getCachedData,
    getCacheKey,
    patchCachedStudent,
    removeCachedStudent,
    setCachedData,
} from './cache'

describe('patchCachedStudent', () => {
    const userId = 'user-1'
    const key = getCacheKey(userId, 'students')

    beforeEach(() => {
        localStorage.clear()
        setCachedData(key, [
            { id: 'a', name: 'Dupont', surname: 'LéA' },
            { id: 'b', name: 'Martin', surname: 'Noé' },
        ])
    })

    afterEach(() => {
        localStorage.clear()
    })

    it('met à jour l’élève dans le cache', () => {
        patchCachedStudent(userId, 'a', { surname: 'Léa', name: 'Dupont' })
        const next = getCachedData<Array<{ id: string; surname: string }>>(key)
        expect(next && next[0].surname).toBe('Léa')
        expect(next && next[1].surname).toBe('Noé')
    })

    it('retire l’élève du cache', () => {
        removeCachedStudent(userId, 'a')
        const next = getCachedData<Array<{ id: string }>>(key)
        expect(next && next.map((s) => s.id)).toEqual(['b'])
    })
})
