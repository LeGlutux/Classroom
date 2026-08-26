import { studentMatchesQuery } from './studentSearch'

describe('studentMatchesQuery', () => {
    const lea = { surname: 'Léa', name: 'Dupont' }

    it('laisse tout passer si la recherche est vide', () => {
        expect(studentMatchesQuery(lea, '')).toBe(true)
        expect(studentMatchesQuery(lea, '   ')).toBe(true)
    })

    it('filtre à chaque lettre, accents ignorés', () => {
        expect(studentMatchesQuery(lea, 'l')).toBe(true)
        expect(studentMatchesQuery(lea, 'lé')).toBe(true)
        expect(studentMatchesQuery(lea, 'lea')).toBe(true)
        expect(studentMatchesQuery(lea, 'dup')).toBe(true)
        expect(studentMatchesQuery(lea, 'z')).toBe(false)
    })

    it('accepte prénom et nom ensemble', () => {
        expect(studentMatchesQuery(lea, 'lea du')).toBe(true)
        expect(studentMatchesQuery(lea, 'dupont lea')).toBe(true)
        expect(studentMatchesQuery(lea, 'lea martin')).toBe(false)
    })
})
