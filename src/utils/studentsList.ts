import { StudentInterface } from '../interfaces/Student'

export const filterStudentsByGroup = (
    list: StudentInterface[],
    group: string
): StudentInterface[] =>
    list
        .filter((student) => {
            if (group === 'tous') return true
            const classes = student.classes
            if (Array.isArray(classes)) {
                return classes.indexOf(group) !== -1
            }
            return classes === group
        })
        .sort((a) => (a.highlight ? -1 : 1))
