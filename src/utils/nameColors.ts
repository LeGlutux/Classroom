export const NAME_INK = '#18181b'
export const NAME_COLOR_SAGE = '#5f7264'

export type NameColorSwatch = {
    id: string
    hex: string
    label: string
}

export type NameColorRule = {
    id: string
    keyword: string
    color: string
}

export const NAME_COLOR_PALETTE: NameColorSwatch[] = [
    { id: 'ink', hex: NAME_INK, label: 'Noir' },
    { id: 'slate', hex: '#64748b', label: 'Gris' },
    { id: 'sage', hex: NAME_COLOR_SAGE, label: 'Gris-vert' },
    { id: 'olive', hex: '#6a7340', label: 'Olive' },
    { id: 'green', hex: '#2f6f4e', label: 'Vert' },
    { id: 'teal', hex: '#2a6a6a', label: 'Sarcelle' },
    { id: 'blue', hex: '#3d5a80', label: 'Bleu' },
    { id: 'navy', hex: '#1e3a5f', label: 'Marine' },
    { id: 'violet', hex: '#534d7a', label: 'Violet' },
    { id: 'brown', hex: '#6b5344', label: 'Brun' },
]

export const DEFAULT_NAME_COLOR_RULES: NameColorRule[] = [
    { id: 'pap', keyword: 'pap', color: NAME_COLOR_SAGE },
    { id: 'pai', keyword: 'pai', color: NAME_INK },
    { id: 'pps', keyword: 'pps', color: NAME_INK },
]

const LETTER_SEP = "[.\\s'’\\-]*"

export const foldSearchText = (value: string) =>
    String(value || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLocaleLowerCase('fr')

export const keywordLetters = (keyword: string) =>
    foldSearchText(keyword).replace(/[^a-z0-9]+/g, '')

const escapeRegex = (value: string) =>
    value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export const paletteColor = (hex: string) => {
    const needle = String(hex || '').toLowerCase()
    const found = NAME_COLOR_PALETTE.find(
        (swatch) => swatch.hex.toLowerCase() === needle
    )
    return found ? found.hex : NAME_INK
}

export const commentMatchesKeyword = (comment: string, keyword: string) => {
    const letters = keywordLetters(keyword)
    if (letters.length < 2) return false
    const hay = foldSearchText(comment)
    if (!hay) return false
    const body = letters
        .split('')
        .map((letter) => escapeRegex(letter))
        .join(LETTER_SEP)
    return new RegExp('(?:^|[^a-z0-9])' + body + '(?![a-z0-9])').test(hay)
}

export const commentNameColor = (
    comment: string | undefined,
    rules: NameColorRule[]
) => {
    const text = comment || ''
    if (!text) return undefined
    for (let i = 0; i < rules.length; i++) {
        if (commentMatchesKeyword(text, rules[i].keyword)) {
            return rules[i].color
        }
    }
    return undefined
}

const parseRule = (item: any): NameColorRule | null => {
    if (!item || typeof item.keyword !== 'string') return null
    const keyword = item.keyword.trim()
    if (keywordLetters(keyword).length < 2) return null
    const id =
        typeof item.id === 'string' && item.id.trim()
            ? item.id.trim()
            : keywordLetters(keyword)
    return {
        id,
        keyword,
        color: paletteColor(item.color),
    }
}

export const parseNameColorRules = (raw: unknown): NameColorRule[] => {
    if (raw === undefined || raw === null) {
        return DEFAULT_NAME_COLOR_RULES.map((rule) => ({ ...rule }))
    }
    if (!Array.isArray(raw)) {
        return DEFAULT_NAME_COLOR_RULES.map((rule) => ({ ...rule }))
    }
    return raw.map(parseRule).filter((rule): rule is NameColorRule => !!rule)
}

export const addNameColorRule = (
    rules: NameColorRule[],
    rawKeyword: string
): { rules: NameColorRule[] } | { error: string } => {
    const keyword = String(rawKeyword || '').trim()
    const letters = keywordLetters(keyword)
    if (letters.length < 2) {
        return { error: 'Indiquez au moins deux lettres.' }
    }
    if (rules.some((rule) => keywordLetters(rule.keyword) === letters)) {
        return { error: 'Ce mot-clé est déjà dans la liste.' }
    }
    return {
        rules: rules.concat({
            id: 'nc_' + Date.now().toString(36),
            keyword,
            color: NAME_INK,
        }),
    }
}

export const setNameColorRuleColor = (
    rules: NameColorRule[],
    id: string,
    color: string
) =>
    rules.map((rule) =>
        rule.id === id ? { ...rule, color: paletteColor(color) } : rule
    )

export const removeNameColorRule = (rules: NameColorRule[], id: string) =>
    rules.filter((rule) => rule.id !== id)
