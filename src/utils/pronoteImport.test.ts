import { parsePronoteCsv, splitPronoteFullName } from './pronoteImport'

describe('splitPronoteFullName', () => {
    it('sépare un NOM en capitales et un prénom', () => {
        expect(splitPronoteFullName('DUPONT Marie')).toEqual({
            name: 'Dupont',
            surname: 'Marie',
        })
    })

    it('ne met pas de majuscule après un accent', () => {
        expect(splitPronoteFullName('BENOÎT Thérèse')).toEqual({
            name: 'Benoît',
            surname: 'Thérèse',
        })
        expect(splitPronoteFullName('FRANÇOIS Léa')).toEqual({
            name: 'François',
            surname: 'Léa',
        })
    })
})

describe('parsePronoteCsv', () => {
    const names = (csv: string) =>
        parsePronoteCsv(csv).map((s) => ({
            name: s.name,
            surname: s.surname,
            classe: s.classe,
            pap: s.pap,
        }))

    it('lit l’ancien export Pronote (colonne Élève)', () => {
        const rows = names(
            'Élève;Né(e) le;Regime\nDUPONT Marie;01/01/2012;PAP dyslexie\nMARTIN Léo;02/02/2012;Externe'
        )
        expect(rows).toEqual([
            {
                name: 'Dupont',
                surname: 'Marie',
                classe: '',
                pap: 'PAP dyslexie',
            },
            {
                name: 'Martin',
                surname: 'Léo',
                classe: '',
                pap: '',
            },
        ])
    })

    it('repère nom, prénom, classe et cases PAP/PPS', () => {
        const rows = names(
            'Nom;Prénom;Classe;PAP;PPS;INE\nDupont;Marie;6A;Oui;;123\nMartin;Léo;6B;;PPS TSA;456'
        )
        expect(rows).toEqual([
            {
                name: 'Dupont',
                surname: 'Marie',
                classe: '6A',
                pap: 'PAP',
            },
            {
                name: 'Martin',
                surname: 'Léo',
                classe: '6B',
                pap: 'PPS TSA',
            },
        ])
    })

    it('repère les colonnes même sans en-têtes classiques', () => {
        const rows = names(
            'Identifiant;Libellé;Groupe\n1;DUPONT Marie;6A\n2;MARTIN Léo;6B'
        )
        expect(rows).toEqual([
            {
                name: 'Dupont',
                surname: 'Marie',
                classe: '6A',
                pap: '',
            },
            {
                name: 'Martin',
                surname: 'Léo',
                classe: '6B',
                pap: '',
            },
        ])
    })

    it('accepte un CSV tabulé', () => {
        const rows = names(
            'Nom\tPrénom\tDivision\nDURAND\tChloé\t5C'
        )
        expect(rows).toEqual([
            {
                name: 'Durand',
                surname: 'Chloé',
                classe: '5C',
                pap: '',
            },
        ])
    })
})
