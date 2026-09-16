export type PronoteLink = {
    url: string
    username: string
    /** Mot de passe Pronote — expérimental, stocké côté compte enseignant. */
    password: string
    linkedAt: number
}

export const emptyPronoteLink = (): PronoteLink => ({
    url: '',
    username: '',
    password: '',
    linkedAt: 0,
})

export const parsePronoteLink = (raw: unknown): PronoteLink | null => {
    if (!raw || typeof raw !== 'object') return null
    const data = raw as { [key: string]: unknown }
    const url = String(data.url || '').trim()
    const username = String(data.username || '').trim()
    const password = String(data.password || '')
    const linkedAt =
        typeof data.linkedAt === 'number' && Number.isFinite(data.linkedAt)
            ? data.linkedAt
            : 0
    if (!url || !username) return null
    return { url, username, password, linkedAt }
}

export const isPronoteLinked = (link: PronoteLink | null | undefined) =>
    !!(link && link.url && link.username && link.password)

export const normalizePronoteUrl = (value: string) => {
    const trimmed = String(value || '').trim()
    if (!trimmed) return ''
    try {
        const withProtocol = /^https?:\/\//i.test(trimmed)
            ? trimmed
            : 'https://' + trimmed
        const parsed = new URL(withProtocol)
        parsed.hash = ''
        let path = parsed.pathname.replace(/\/+$/, '')
        // Espace Professeurs Pronote se termine souvent par /pronote ou /eleve
        if (!path) path = '/pronote'
        return parsed.origin + path
    } catch (err) {
        return trimmed.replace(/\/+$/, '')
    }
}
