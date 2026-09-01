import {
    SCHOOL_YEAR_WEEKS,
    schoolWeekNumber,
    schoolWeekStart,
    schoolYearStart,
} from './schoolWeeks'

describe('schoolYearStart', () => {
    it('reprend au 1er septembre, même si ce n’est pas un lundi', () => {
        expect(schoolYearStart(new Date(2026, 8, 1))).toEqual(
            new Date(2026, 8, 1)
        )
        expect(schoolYearStart(new Date(2026, 8, 2))).toEqual(
            new Date(2026, 8, 1)
        )
    })

    it('reste sur l’année précédente jusqu’au 31 août', () => {
        expect(schoolYearStart(new Date(2026, 7, 31))).toEqual(
            new Date(2025, 8, 1)
        )
    })
})

describe('schoolWeekNumber', () => {
    it('affiche la semaine 1 dès le 1er septembre', () => {
        expect(schoolWeekNumber(new Date(2026, 8, 1))).toBe(1)
        expect(schoolWeekNumber(new Date(2026, 8, 7))).toBe(1)
        expect(schoolWeekNumber(new Date(2026, 8, 8))).toBe(2)
    })

    it('ne dépasse pas 52 semaines, y compris fin août', () => {
        expect(schoolWeekNumber(new Date(2026, 7, 31))).toBe(SCHOOL_YEAR_WEEKS)
        expect(schoolWeekNumber(new Date(2026, 7, 24))).toBe(SCHOOL_YEAR_WEEKS)
    })

    it('compte les semaines depuis le 1er septembre', () => {
        expect(schoolWeekNumber(new Date(2025, 8, 1))).toBe(1)
        expect(schoolWeekNumber(new Date(2025, 9, 1))).toBe(5)
    })
})

describe('schoolWeekStart', () => {
    it('aligne chaque ligne sur 7 jours à partir du 1er septembre', () => {
        const start = new Date(2026, 8, 1)
        expect(schoolWeekStart(start, 1)).toEqual(start)
        expect(schoolWeekStart(start, 2)).toEqual(new Date(2026, 8, 8))
    })
})
