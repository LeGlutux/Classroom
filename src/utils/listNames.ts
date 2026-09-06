import { givenNameKey, lastNameHint } from '../seatingPlan'

export const MAX_LIST_NAME_CHARS = 16

export const clipListName = (text: string, max: number) => {
    const value = (text || '').trim()
    if (value.length <= max) return value
    if (max <= 1) return '.'
    return value.substring(0, max - 1) + '.'
}

export const formatListStudentName = (
    student: { surname: string; name: string },
    classmates: { surname: string }[],
    maxChars = MAX_LIST_NAME_CHARS
) => {
    const prenom = (student.surname || '').trim()
    const nom = (student.name || '').trim()
    const key = givenNameKey(student.surname)
    const twins =
        classmates.filter((mate) => givenNameKey(mate.surname) === key)
            .length > 1

    if (!twins) return clipListName(prenom, maxChars)

    const hint = lastNameHint(nom)
    const room = hint ? hint.length + 1 : 0
    const head = clipListName(prenom, Math.max(1, maxChars - room))
    return hint ? head + ' ' + hint : head
}
