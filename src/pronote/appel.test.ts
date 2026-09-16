import {
    buildAppelPayload,
    formatAppelStudentLabel,
    postAppelToBridge,
    sortAppelStudents,
    submitPronoteAppel,
} from './appel'
import { PronoteLink } from './link'

const link: PronoteLink = {
    url: 'https://demo.index-education.net/pronote',
    username: 'prof',
    password: 'secret',
    linkedAt: 1,
}

describe('formatAppelStudentLabel', () => {
    it('assemble prénom et nom', () => {
        expect(
            formatAppelStudentLabel({
                id: '1',
                name: 'Dupont',
                surname: 'Léa',
            })
        ).toBe('Léa Dupont')
    })
})

describe('sortAppelStudents', () => {
    it('trie par libellé FR', () => {
        const sorted = sortAppelStudents([
            { id: '2', name: 'Martin', surname: 'Zoé' },
            { id: '1', name: 'Dupont', surname: 'Alice' },
        ])
        expect(sorted.map((s) => s.id)).toEqual(['1', '2'])
    })
})

describe('buildAppelPayload', () => {
    it('normalise la classe et trie les absents', () => {
        const payload = buildAppelPayload(
            ' 6A ',
            [
                { id: '2', name: 'B', surname: 'Bob' },
                { id: '1', name: 'A', surname: 'Ada' },
            ],
            18,
            1700000000000
        )
        expect(payload.classe).toBe('6A')
        expect(payload.presentCount).toBe(18)
        expect(payload.absents.map((s) => s.id)).toEqual(['1', '2'])
    })
})

describe('submitPronoteAppel', () => {
    it('demande la liaison si le compte n’est pas lié', async () => {
        const result = await submitPronoteAppel({
            link: null,
            payload: buildAppelPayload('6A', [], 20),
        })
        expect(result).toEqual({ status: 'need_link' })
    })

    it('refuse une classe vide', async () => {
        const result = await submitPronoteAppel({
            link,
            payload: buildAppelPayload('', [], 0),
        })
        expect(result.status).toBe('error')
    })

    it('enregistre puis signale l’absence de pont', async () => {
        const recorded: unknown[] = []
        const result = await submitPronoteAppel({
            link,
            payload: buildAppelPayload('6A', [], 20, 1700000000000),
            recordAttempt: async (payload) => {
                recorded.push(payload.classe)
            },
        })
        expect(recorded).toEqual(['6A'])
        expect(result.status).toBe('error')
        if (result.status === 'error') {
            expect(result.message).toMatch(/pont/i)
        }
    })

    it('poste vers le pont quand l’URL est fournie', async () => {
        const prev = process.env.REACT_APP_PRONOTE_APPEL_URL
        process.env.REACT_APP_PRONOTE_APPEL_URL = 'https://bridge.example/appel'
        try {
            const result = await postAppelToBridge(
                'https://bridge.example/appel',
                link,
                buildAppelPayload(
                    '6A',
                    [{ id: '1', name: 'Dupont', surname: 'Léa' }],
                    19,
                    1700000000000
                ),
                async (_url, init) => {
                    const body = JSON.parse(String(init && init.body))
                    expect(body.pronote.username).toBe('prof')
                    expect(body.appel.validate).toBe(true)
                    expect(body.appel.absents).toHaveLength(1)
                    return {
                        ok: true,
                        status: 200,
                        json: async () => ({}),
                    } as Response
                }
            )
            expect(result).toEqual({
                status: 'ok',
                lessonLabel: expect.any(String),
                via: 'bridge',
            })
        } finally {
            if (prev === undefined) delete process.env.REACT_APP_PRONOTE_APPEL_URL
            else process.env.REACT_APP_PRONOTE_APPEL_URL = prev
        }
    })
})
