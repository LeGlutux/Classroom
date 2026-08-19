import Papa from 'papaparse'

export interface PronoteStudent {
    surname: string
    name: string
    id: string
    pap: string
    classe: string
}

const ACCOM_VALUE_WORDS = [
    'pap',
    'pps',
    'pai',
    'ppre',
    'dys',
    'mdph',
    'tsa',
    'tdah',
    'ulis',
    'aesh',
    'avs',
    'gevasco',
    'amenagement',
    'aménagement',
    'orthophon',
]

const titleCaseWord = (word: string) => {
    if (!word) return ''
    const lower = word.toLowerCase()
    return lower.charAt(0).toUpperCase() + lower.slice(1)
}

const titleCaseName = (value: string) =>
    value
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map(titleCaseWord)
        .join(' ')

const normalize = (value: string) =>
    value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/['’]/g, ' ')
        .replace(/[^a-z0-9]+/g, ' ')
        .trim()

const isAllCapsWord = (word: string) => {
    const letters = word.replace(/[^A-Za-zÀ-ÿ]/g, '')
    return letters.length > 1 && word === word.toUpperCase()
}

export const splitPronoteFullName = (raw: string) => {
    const words = raw.trim().split(/\s+/).filter(Boolean)
    const last: string[] = []
    const first: string[] = []
    words.forEach((word) => {
        const cased = titleCaseWord(word)
        if (isAllCapsWord(word)) last.push(cased)
        else first.push(cased)
    })
    if (last.length === 0 && words.length > 1) {
        last.push(titleCaseWord(words[0]))
        first.push(
            words
                .slice(1)
                .map(titleCaseWord)
                .join(' ')
        )
    }
    if (last.length === 0 && words.length === 1) {
        last.push(titleCaseWord(words[0]))
    }
    return {
        name: last.join(' '),
        surname: first.join(' '),
    }
}

const headerKind = (
    header: string
): 'full' | 'last' | 'first' | 'class' | 'accom' | 'other' => {
    const n = normalize(header)
    if (!n) return 'other'
    if (
        n.indexOf('classe') !== -1 ||
        n === 'division' ||
        n === 'div' ||
        n.indexOf('division') !== -1 ||
        n === 'groupe classe'
    ) {
        return 'class'
    }
    if (
        n === 'eleve' ||
        n === 'eleves' ||
        n.indexOf('nom prenom') !== -1 ||
        n.indexOf('prenom nom') !== -1 ||
        n === 'identite' ||
        n.indexOf('identite') !== -1 ||
        (n.indexOf('eleve') !== -1 &&
            n.indexOf('nombre') === -1 &&
            n.indexOf('nb ') === -1 &&
            n.indexOf('classe') === -1)
    ) {
        return 'full'
    }
    if (n === 'prenom' || n.indexOf('prenom') === 0) return 'first'
    if (
        n === 'nom' ||
        n === 'nom de famille' ||
        n === 'patronyme' ||
        n === 'nom usage'
    )
        return 'last'
    const accomHints = [
        'pap',
        'pps',
        'pai',
        'ppre',
        'amenagement',
        'dys',
        'mdph',
        'aesh',
        'avs',
        'besoin',
        'particularite',
        'projet personnalise',
    ]
    for (let i = 0; i < accomHints.length; i++) {
        if (n === accomHints[i] || n.indexOf(accomHints[i]) !== -1) return 'accom'
    }
    return 'other'
}

const looksLikeFullName = (value: string) => {
    const words = value.trim().split(/\s+/).filter(Boolean)
    if (words.length < 2) return false
    return words.some(isAllCapsWord)
}

const looksLikeClass = (value: string) => {
    const t = value.trim()
    if (!t || t.length > 20 || t.length < 2) return false
    const compact = normalize(t).replace(/\s/g, '')
    if (/^[1-6][a-z][a-z0-9]{0,3}$/.test(compact)) return true
    if (/^[1-6]e(me)?[a-z0-9]*$/.test(compact)) return true
    if (/^(2nde|1ere|tle|tl|terminale)[a-z0-9]*$/.test(compact)) return true
    return /([1-6]\s*[eèê]me)/i.test(t)
}

const cellLooksLikeAccom = (value: string) => {
    const n = normalize(value)
    if (!n || n === 'non' || n === 'oui' || n === '0' || n === '1') return false
    return ACCOM_VALUE_WORDS.some(
        (word) => n === word || n.indexOf(word) !== -1
    )
}

const uniquePush = (list: string[], value: string) => {
    const trimmed = value.trim()
    if (!trimmed) return
    if (list.indexOf(trimmed) === -1) list.push(trimmed)
}

const detectDelimiter = (text: string) => {
    const line =
        text
            .replace(/^\uFEFF/, '')
            .split(/\r?\n/)
            .find((row) => row.trim()) || ''
    const scores = [
        { d: ';', n: (line.match(/;/g) || []).length },
        { d: '\t', n: (line.match(/\t/g) || []).length },
        { d: ',', n: (line.match(/,/g) || []).length },
    ]
    scores.sort((a, b) => b.n - a.n)
    return scores[0].n > 0 ? scores[0].d : ';'
}

export const parsePronoteCsv = (text: string): PronoteStudent[] => {
    const parsed = Papa.parse(text.replace(/^\uFEFF/, ''), {
        header: true,
        skipEmptyLines: true,
        delimiter: detectDelimiter(text),
        transformHeader: (header: string, index: number) => {
            const trimmed = (header || '').trim()
            return trimmed || 'Colonne_' + index
        },
    })

    const fields = parsed.meta.fields || []
    const kinds = fields.map(headerKind)
    let fullKey = fields[kinds.indexOf('full')]
    let lastKey = fields[kinds.indexOf('last')]
    let firstKey = fields[kinds.indexOf('first')]
    let classKey = fields[kinds.indexOf('class')]
    const accomKeys = fields.filter((_, i) => kinds[i] === 'accom')

    const rows = (parsed.data || []).filter(
        (row) => row && typeof row === 'object'
    ) as { [key: string]: any }[]

    const nameThreshold = Math.max(1, Math.ceil(rows.length * 0.3))
    if (!fullKey && !(lastKey && firstKey)) {
        let best = { key: '', score: 0 }
        fields.forEach((key) => {
            const score = rows.filter((row) =>
                looksLikeFullName(String(row[key] || ''))
            ).length
            if (score > best.score) best = { key, score }
        })
        if (best.score >= nameThreshold) {
            fullKey = best.key
        }
    }

    if (!fullKey && lastKey && !firstKey) {
        const score = rows.filter((row) =>
            looksLikeFullName(String(row[lastKey] || ''))
        ).length
        if (score >= nameThreshold) {
            fullKey = lastKey
            lastKey = ''
        }
    }

    if (!classKey) {
        let best = { key: '', score: 0 }
        fields.forEach((key) => {
            if (key === fullKey || key === lastKey || key === firstKey) return
            const score = rows.filter((row) =>
                looksLikeClass(String(row[key] || ''))
            ).length
            if (score > best.score) best = { key, score }
        })
        if (best.score >= nameThreshold) {
            classKey = best.key
        }
    }

    const students: PronoteStudent[] = []
    rows.forEach((row) => {
        let name = ''
        let surname = ''
        if (fullKey) {
            const raw = String(row[fullKey] || '').trim()
            if (!raw) return
            const split = splitPronoteFullName(raw)
            name = split.name
            surname = split.surname
        } else {
            name = titleCaseName(String(row[lastKey] || ''))
            surname = titleCaseName(String(row[firstKey] || ''))
        }
        if (!name && !surname) return
        const identity = normalize(name + ' ' + surname)
        if (
            identity === 'eleve' ||
            identity === 'eleves' ||
            identity === 'nom' ||
            identity === 'prenom'
        )
            return

        const classe = classKey ? String(row[classKey] || '').trim() : ''
        const papParts: string[] = []
        accomKeys.forEach((key) => {
            const value = String(row[key] || '').trim()
            if (!value) return
            const n = normalize(value)
            if (n === 'non' || n === '0' || n === 'false' || n === 'aucun')
                return
            if (n === 'oui' || n === '1' || n === 'x' || n === 'true') {
                uniquePush(papParts, key)
                return
            }
            uniquePush(papParts, value)
        })
        Object.keys(row).forEach((key) => {
            if (key === fullKey || key === lastKey || key === firstKey || key === classKey)
                return
            if (accomKeys.indexOf(key) !== -1) return
            const value = String(row[key] || '')
            if (cellLooksLikeAccom(value)) uniquePush(papParts, value)
        })

        students.push({
            id: Math.random().toString(36).substring(2, 9),
            name,
            surname,
            classe,
            pap: papParts.join(', '),
        })
    })

    return students
}
