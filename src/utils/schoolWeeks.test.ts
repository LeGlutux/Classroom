import {
    SCHOOL_YEAR_WEEKS,
    mondayOnOrBefore,
    schoolWeekNumber,
    schoolWeekStart,
    schoolYearStart,
} from './schoolWeeks'

describe('mondayOnOrBefore', () => {
    it('renvoie le lundi de la semaine', () => {
        expect(mondayOnOrBefore(new Date(2026, 8, 1))).toEqual(
            new Date(2026, 7, 31)
        )
        expect(mondayOnOrBefore(new Date(2025, 8, 1))).toEqual(
            new Date(2025, 8, 1)
        )
        expect(mondayOnOrBefore(new Date(2026, 8, 6))).toEqual(
            new Date(2026, 7, 31)
        )
    })
})

describe('schoolYearStart', () => {
    it('part du lundi de la semaine du 1er septembre', () => {
        expect(schoolYearStart(new Date(2026, 8, 1))).toEqual(
            new Date(2026, 7, 31)
        )
        expect(schoolYearStart(new Date(2026, 8, 2))).toEqual(
            new Date(2026, 7, 31)
        )
        expect(schoolYearStart(new Date(2025, 8, 1))).toEqual(
            new Date(2025, 8, 1)
        )
    })

    it('reste sur l’année précédente jusqu’au 31 août', () => {
        expect(schoolYearStart(new Date(2026, 7, 31))).toEqual(
            new Date(2025, 8, 1)
        )
    })
})

describe('schoolWeekNumber', () => {
    it('affiche la semaine 1 dès le 1er septembre (lundi → dimanche)', () => {
        expect(schoolWeekNumber(new Date(2026, 8, 1))).toBe(1)
        expect(schoolWeekNumber(new Date(2026, 8, 6))).toBe(1)
        expect(schoolWeekNumber(new Date(2026, 8, 7))).toBe(2)
    })

    it('ne dépasse pas 52 semaines, y compris fin août', () => {
        expect(schoolWeekNumber(new Date(2026, 7, 31))).toBe(SCHOOL_YEAR_WEEKS)
        expect(schoolWeekNumber(new Date(2026, 7, 24))).toBe(SCHOOL_YEAR_WEEKS)
    })

    it('compte les semaines depuis le lundi de rentrée', () => {
        expect(schoolWeekNumber(new Date(2025, 8, 1))).toBe(1)
        expect(schoolWeekNumber(new Date(2025, 9, 1))).toBe(5)
    })
})

describe('schoolWeekStart', () => {
    it('aligne chaque ligne lundi → dimanche', () => {
        const start = new Date(2026, 7, 31)
        expect(schoolWeekStart(start, 1)).toEqual(start)
        expect(schoolWeekStart(start, 2)).toEqual(new Date(2026, 8, 7))
        expect(schoolWeekStart(start, 1).getDay()).toBe(1)
        expect(schoolWeekStart(start, 2).getDay()).toBe(1)
    })
})
