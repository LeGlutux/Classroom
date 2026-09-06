import { formatListStudentName } from './listNames'

describe('formatListStudentName', () => {
    it('n’affiche que le prénom s’il est unique', () => {
        expect(
            formatListStudentName(
                { surname: 'Pat', name: 'Mercier' },
                [{ surname: 'Pat' }]
            )
        ).toBe('Pat')
        expect(
            formatListStudentName(
                { surname: 'Christophe', name: 'Dupont' },
                [{ surname: 'Christophe' }]
            )
        ).toBe('Christophe')
    })

    it('coupe le prénom s’il est trop long', () => {
        const value = formatListStudentName(
            { surname: 'Christophe', name: 'Dupont' },
            [{ surname: 'Christophe' }],
            8
        )
        expect(value).toBe('Christo.')
    })

    it('ajoute les 3 lettres du nom en cas d’homonyme', () => {
        const mates = [{ surname: 'Léa' }, { surname: 'Léa' }]
        expect(
            formatListStudentName(
                { surname: 'Léa', name: 'Dupont' },
                mates
            )
        ).toBe('Léa Dup')
        expect(
            formatListStudentName(
                { surname: 'Léa', name: 'Martin' },
                mates
            )
        ).toBe('Léa Mar')
    })

    it('coupe le prénom pour laisser la place au hint d’homonyme', () => {
        const mates = [
            { surname: 'Marie-Christelle' },
            { surname: 'Marie-Christelle' },
        ]
        expect(
            formatListStudentName(
                { surname: 'Marie-Christelle', name: 'Dupont' },
                mates
            )
        ).toBe('Marie-Chris. Dup')
    })
})
