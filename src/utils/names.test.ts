import { titleCasePersonName, titleCaseWord } from './names'

describe('titleCasePersonName', () => {
    it('met une majuscule en tête de chaque prénom et de chaque nom', () => {
        expect(titleCasePersonName('marie claire')).toBe('Marie Claire')
        expect(titleCasePersonName('dupont martin')).toBe('Dupont Martin')
    })

    it('ne recasse pas après un accent', () => {
        expect(titleCasePersonName('léa')).toBe('Léa')
        expect(titleCasePersonName('LÉA')).toBe('Léa')
        expect(titleCasePersonName('thérèse')).toBe('Thérèse')
        expect(titleCasePersonName('hélène')).toBe('Hélène')
        expect(titleCasePersonName('noël')).toBe('Noël')
        expect(titleCasePersonName('françois')).toBe('François')
        expect(titleCasePersonName('renée')).toBe('Renée')
        expect(titleCasePersonName('gaël')).toBe('Gaël')
        expect(titleCasePersonName('cécile')).toBe('Cécile')
        expect(titleCasePersonName('anaïs')).toBe('Anaïs')
        expect(titleCasePersonName('joël')).toBe('Joël')
        expect('léa'.replace(/\b\w/g, (c) => c.toUpperCase())).toBe('LéA')
        expect('thérèse'.replace(/\b\w/g, (c) => c.toUpperCase())).toBe(
            'ThéRèSe'
        )
    })

    it('garde une majuscule après un tiret ou une apostrophe', () => {
        expect(titleCasePersonName('jean-pierre')).toBe('Jean-Pierre')
        expect(titleCasePersonName('marie-claire')).toBe('Marie-Claire')
        expect(titleCasePersonName("o'connor")).toBe("O'Connor")
        expect(titleCasePersonName('l’heure')).toBe('L’Heure')
    })

    it('tolère les espaces en trop', () => {
        expect(titleCasePersonName('  léa   dupont  ')).toBe('Léa Dupont')
    })
})

describe('titleCaseWord', () => {
    it('laisse un mot vide tel quel', () => {
        expect(titleCaseWord('')).toBe('')
    })
})
