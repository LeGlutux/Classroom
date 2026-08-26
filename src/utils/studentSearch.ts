export const normalizeSearch = (value: string) =>
    String(value || '')
        .toLocaleLowerCase('fr')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()

export const studentMatchesQuery = (
    student: { name?: string; surname?: string },
    query: string
) => {
    const q = normalizeSearch(query)
    if (!q) return true
    const hay = normalizeSearch(
        [student.surname, student.name].filter(Boolean).join(' ')
    )
    const parts = q.split(/\s+/).filter(Boolean)
    return parts.every((part) => hay.indexOf(part) !== -1)
}
