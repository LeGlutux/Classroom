import {
    addNameColorRule,
    commentMatchesKeyword,
    commentNameColor,
    DEFAULT_NAME_COLOR_RULES,
    foldSearchText,
    keywordLetters,
    NAME_COLOR_SAGE,
    NAME_INK,
    parseNameColorRules,
} from './nameColors'

describe('foldSearchText', () => {
    it('ignore la casse et les accents', () => {
        expect(foldSearchText('ÉLÈVE')).toBe('eleve')
        expect(foldSearchText('P.A.P.')).toBe('p.a.p.')
    })
})

describe('keywordLetters', () => {
    it('retire les points et espaces', () => {
        expect(keywordLetters('P.A.P.')).toBe('pap')
        expect(keywordLetters(' pap ')).toBe('pap')
        expect(keywordLetters('élève')).toBe('eleve')
    })
})

describe('commentMatchesKeyword', () => {
    it('repère pap / pai / pps avec casse et points, sans coller au mot suivant', () => {
        expect(commentMatchesKeyword('PAP notifié', 'pap')).toBe(true)
        expect(commentMatchesKeyword('P.A.P.', 'pap')).toBe(true)
        expect(commentMatchesKeyword('p.a.p ok', 'pap')).toBe(true)
        expect(commentMatchesKeyword('pap.', 'pap')).toBe(true)
        expect(commentMatchesKeyword('le pap,', 'pap')).toBe(true)
        expect(commentMatchesKeyword('PAI alimentaire', 'pai')).toBe(true)
        expect(commentMatchesKeyword('PPS', 'pps')).toBe(true)
        expect(commentMatchesKeyword('papa', 'pap')).toBe(false)
        expect(commentMatchesKeyword('papi', 'pap')).toBe(false)
        expect(commentMatchesKeyword('PPAP', 'pap')).toBe(false)
        expect(commentMatchesKeyword('', 'pap')).toBe(false)
    })

    it('accepte un mot-clé accentué quelle que soit la saisie', () => {
        expect(commentMatchesKeyword('Élève dys', 'eleve')).toBe(true)
        expect(commentMatchesKeyword('eleve suivi', 'élève')).toBe(true)
        expect(commentMatchesKeyword('eleves', 'élève')).toBe(false)
    })
})

describe('commentNameColor', () => {
    it('prend le premier détecteur qui matche', () => {
        expect(commentNameColor('PAP et PAI', DEFAULT_NAME_COLOR_RULES)).toBe(
            NAME_COLOR_SAGE
        )
        expect(commentNameColor('PAI', DEFAULT_NAME_COLOR_RULES)).toBe(NAME_INK)
        expect(commentNameColor('rien', DEFAULT_NAME_COLOR_RULES)).toBe(
            undefined
        )
    })
})

describe('parseNameColorRules', () => {
    it('reprend pap / pai / pps si rien n’est enregistré', () => {
        expect(parseNameColorRules(undefined)).toEqual(DEFAULT_NAME_COLOR_RULES)
        expect(parseNameColorRules([])).toEqual([])
    })
})

describe('addNameColorRule', () => {
    it('refuse les doublons même avec une autre casse', () => {
        const added = addNameColorRule(DEFAULT_NAME_COLOR_RULES, 'P.A.P')
        expect('error' in added && added.error).toBeTruthy()
        const fresh = addNameColorRule(DEFAULT_NAME_COLOR_RULES, 'AESH')
        expect('rules' in fresh && fresh.rules[fresh.rules.length - 1].keyword).toBe(
            'AESH'
        )
        expect(
            'rules' in fresh && fresh.rules[fresh.rules.length - 1].color
        ).toBe(NAME_INK)
    })
})
