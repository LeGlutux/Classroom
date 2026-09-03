import {
    compareStudentsByListColumn,
    listStatusSortRank,
    normalizeListState,
    sortStudentsByListColumn,
} from './listSort'

describe('listStatusSortRank', () => {
    it('ordonne vide, rouge, ?, vert', () => {
        expect(listStatusSortRank(0)).toBe(0)
        expect(listStatusSortRank(2)).toBe(1)
        expect(listStatusSortRank(3)).toBe(2)
        expect(listStatusSortRank(1)).toBe(3)
        expect(listStatusSortRank(99)).toBe(0)
    })
})

describe('normalizeListState', () => {
    it('complète et nettoie un tableau d’états', () => {
        expect(normalizeListState([1, 2])).toEqual([1, 2, 0, 0, 0])
        expect(normalizeListState(undefined)).toEqual([0, 0, 0, 0, 0])
    })
})

describe('sortStudentsByListColumn', () => {
    const students = [
        { id: 'a', name: 'Dupont', surname: 'Léa' },
        { id: 'b', name: 'Martin', surname: 'Adam' },
        { id: 'c', name: 'Bernard', surname: 'Zoé' },
        { id: 'd', name: 'Petit', surname: 'Inès' },
    ]
    const states = {
        a: [1, 0, 0, 0, 0],
        b: [0, 0, 0, 0, 0],
        c: [3, 0, 0, 0, 0],
        d: [2, 0, 0, 0, 0],
    }

    it('classe vide → rouge → ? → vert, puis alpha à égalité', () => {
        expect(
            sortStudentsByListColumn(students, 0, states).map((s) => s.id)
        ).toEqual(['b', 'd', 'c', 'a'])
    })

    it('revient à l’ordre alphabétique sans colonne', () => {
        expect(
            sortStudentsByListColumn(students, null, states).map((s) => s.id)
        ).toEqual(['c', 'a', 'b', 'd'])
    })

    it('garde l’alpha comme départage', () => {
        const tied = {
            a: [0, 0, 0, 0, 0],
            b: [0, 0, 0, 0, 0],
            c: [0, 0, 0, 0, 0],
            d: [0, 0, 0, 0, 0],
        }
        expect(
            sortStudentsByListColumn(students, 0, tied).map((s) => s.id)
        ).toEqual(['c', 'a', 'b', 'd'])
    })
})

describe('compareStudentsByListColumn', () => {
    it('traite un état manquant comme une case vide', () => {
        const a = { id: 'a', name: 'Aaa', surname: 'A' }
        const b = { id: 'b', name: 'Bbb', surname: 'B' }
        expect(
            compareStudentsByListColumn(a, b, 0, { b: [1, 0, 0, 0, 0] })
        ).toBeLessThan(0)
    })
})
