import { filterStudentsByGroup } from './studentsList'
import { StudentInterface } from '../interfaces/Student'

const student = (
    id: string,
    extra: Partial<StudentInterface> = {}
): StudentInterface => ({
    id,
    name: extra.name || 'Dupont',
    surname: extra.surname || 'Léa',
    classes: extra.classes || ['6A'],
    highlight: extra.highlight || false,
    selected: extra.selected || false,
})

describe('filterStudentsByGroup', () => {
    const list = [
        student('1', { classes: ['6A'], surname: 'Léa' }),
        student('2', { classes: ['5B'], surname: 'Noé' }),
        student('3', { classes: ['6A'], highlight: true, surname: 'Chloé' }),
    ]

    it('garde tout le monde pour « tous »', () => {
        expect(filterStudentsByGroup(list, 'tous').map((s) => s.id).sort()).toEqual(
            ['1', '2', '3']
        )
    })

    it('filtre une classe et met les élèves mis en avant en premier', () => {
        const ids = filterStudentsByGroup(list, '6A').map((s) => s.id)
        expect(ids.indexOf('2')).toBe(-1)
        expect(ids[0]).toBe('3')
        expect(ids).toContain('1')
    })
})
