const NAME_BREAK = /([-''′’])/

const titleCasePart = (part: string) => {
    if (!part) return ''
    const lower = part.toLocaleLowerCase('fr')
    return lower.charAt(0).toLocaleUpperCase('fr') + lower.slice(1)
}

export const titleCaseWord = (word: string) => {
    if (!word) return ''
    return word
        .split(NAME_BREAK)
        .map((piece) => (NAME_BREAK.test(piece) ? piece : titleCasePart(piece)))
        .join('')
}

export const titleCasePersonName = (value: string) =>
    String(value || '')
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map(titleCaseWord)
        .join(' ')
