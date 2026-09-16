import {
    isPronoteLinked,
    normalizePronoteUrl,
    parsePronoteLink,
    PronoteLink,
} from './link'

export type AppelStudent = {
    id: string
    name: string
    surname: string
    pronoteId?: string
}

export type AppelPayload = {
    classe: string
    at: number
    absents: AppelStudent[]
    presentCount: number
}

export type AppelSubmitResult =
    | { status: 'ok'; lessonLabel: string; via: 'bridge' | 'recorded' }
    | { status: 'need_link' }
    | { status: 'error'; message: string }

export const formatAppelStudentLabel = (student: AppelStudent) => {
    const surname = String(student.surname || '').trim()
    const name = String(student.name || '').trim()
    if (surname && name) return surname + ' ' + name
    return surname || name || 'Élève'
}

export const sortAppelStudents = (students: AppelStudent[]) =>
    students.slice().sort((a, b) =>
        formatAppelStudentLabel(a).localeCompare(
            formatAppelStudentLabel(b),
            'fr',
            { sensitivity: 'base' }
        )
    )

export const currentLessonLabel = (at: number = Date.now()) => {
    const date = new Date(at)
    const day = date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    })
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return day + ' · ' + hours + 'h' + minutes
}

export const buildAppelPayload = (
    classe: string,
    absents: AppelStudent[],
    presentCount: number,
    at: number = Date.now()
): AppelPayload => ({
    classe: String(classe || '').trim(),
    at,
    absents: sortAppelStudents(absents),
    presentCount: Math.max(0, presentCount),
})

/** Endpoint optionnel (Cloud Function / proxy) pour pousser l'appel vers Pronote. */
export const pronoteAppelBridgeUrl = () => {
    const fromEnv =
        typeof process !== 'undefined' &&
        process.env &&
        process.env.REACT_APP_PRONOTE_APPEL_URL
            ? String(process.env.REACT_APP_PRONOTE_APPEL_URL).trim()
            : ''
    return fromEnv
}

type FetchLike = (
    input: RequestInfo,
    init?: RequestInit
) => Promise<Response>

export const postAppelToBridge = async (
    bridgeUrl: string,
    link: PronoteLink,
    payload: AppelPayload,
    fetchImpl: FetchLike = fetch
): Promise<AppelSubmitResult> => {
    const response = await fetchImpl(bridgeUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            pronote: {
                url: normalizePronoteUrl(link.url),
                username: link.username,
                password: link.password,
            },
            appel: {
                classe: payload.classe,
                at: payload.at,
                lessonLabel: currentLessonLabel(payload.at),
                absents: payload.absents.map((student) => ({
                    id: student.id,
                    pronoteId: student.pronoteId || null,
                    name: student.name,
                    surname: student.surname,
                    label: formatAppelStudentLabel(student),
                })),
                presentCount: payload.presentCount,
                validate: true,
            },
        }),
    })
    if (!response.ok) {
        let detail = ''
        try {
            const body = await response.json()
            if (body && typeof body.message === 'string') detail = body.message
        } catch (err) {
            // ignore
        }
        return {
            status: 'error',
            message:
                detail ||
                'Le pont Pronote a renvoyé une erreur (' +
                    response.status +
                    ').',
        }
    }
    return {
        status: 'ok',
        lessonLabel: currentLessonLabel(payload.at),
        via: 'bridge',
    }
}

/**
 * Envoi de l'appel vers Pronote.
 * Sans REACT_APP_PRONOTE_APPEL_URL, on enregistre la tentative et on explique
 * qu'Index Éducation n'expose pas d'API publique d'écriture de feuille d'appel
 * utilisable depuis le navigateur (CORS + protocole propriétaire).
 */
export const submitPronoteAppel = async (params: {
    link: PronoteLink | null | undefined
    payload: AppelPayload
    recordAttempt?: (payload: AppelPayload, link: PronoteLink) => Promise<void>
    fetchImpl?: FetchLike
}): Promise<AppelSubmitResult> => {
    const link = params.link
    if (!isPronoteLinked(link)) {
        return { status: 'need_link' }
    }
    const ready = link as PronoteLink
    const payload = params.payload
    if (!payload.classe) {
        return {
            status: 'error',
            message: 'Choisissez une classe avant de valider l’appel.',
        }
    }

    if (params.recordAttempt) {
        try {
            await params.recordAttempt(payload, ready)
        } catch (err) {
            return {
                status: 'error',
                message: 'Impossible d’enregistrer l’appel localement.',
            }
        }
    }

    const bridgeUrl = pronoteAppelBridgeUrl()
    if (bridgeUrl) {
        try {
            return await postAppelToBridge(
                bridgeUrl,
                ready,
                payload,
                params.fetchImpl || fetch
            )
        } catch (err) {
            return {
                status: 'error',
                message:
                    'Le pont Pronote est injoignable. Vérifiez REACT_APP_PRONOTE_APPEL_URL.',
            }
        }
    }

    return {
        status: 'error',
        message:
            'Compte Pronote lié, mais aucun pont d’écriture n’est configuré. Pronote n’offre pas d’API publique pour cocher les absences / valider l’appel depuis une app tierce : il faut un backend (REACT_APP_PRONOTE_APPEL_URL) qui parle au protocole Pronote professeur.',
    }
}

export const linkFromUserData = (data: unknown) => {
    if (!data || typeof data !== 'object') return null
    return parsePronoteLink((data as { pronoteLink?: unknown }).pronoteLink)
}
