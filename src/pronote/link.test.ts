import {
    isPronoteLinked,
    normalizePronoteUrl,
    parsePronoteLink,
} from './link'

describe('parsePronoteLink', () => {
    it('rejette un lien incomplet', () => {
        expect(parsePronoteLink({ url: 'https://x', username: 'a' })).toBeNull()
    })

    it('accepte un lien complet', () => {
        expect(
            parsePronoteLink({
                url: ' https://demo/pronote ',
                username: ' prof ',
                password: 'x',
                linkedAt: 42,
            })
        ).toEqual({
            url: 'https://demo/pronote',
            username: 'prof',
            password: 'x',
            linkedAt: 42,
        })
    })
})

describe('normalizePronoteUrl', () => {
    it('ajoute https et retire le slash final', () => {
        expect(normalizePronoteUrl('demo.index-education.net/pronote/')).toBe(
            'https://demo.index-education.net/pronote'
        )
    })
})

describe('isPronoteLinked', () => {
    it('détecte un compte lié', () => {
        expect(
            isPronoteLinked({
                url: 'https://x/pronote',
                username: 'a',
                password: 'b',
                linkedAt: 1,
            })
        ).toBe(true)
        expect(isPronoteLinked(null)).toBe(false)
    })
})
