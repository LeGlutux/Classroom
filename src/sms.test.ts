import {
    buildSmsUrl,
    cleanPhoneNumber,
    DEFAULT_SMS_TEMPLATES,
    fillSmsTemplate,
    normalizeSmsTemplates,
} from './sms'

describe('fillSmsTemplate', () => {
    const student = { prenom: 'Léa', nom: 'Dupont', classe: '6A' }

    it('remplace prénom, nom et classe', () => {
        expect(
            fillSmsTemplate(
                'Bonjour, {prénom} {nom} en {classe}.',
                student
            )
        ).toBe('Bonjour, Léa Dupont en 6A.')
    })

    it('accepte prenom sans accent', () => {
        expect(fillSmsTemplate('{prenom}', student)).toBe('Léa')
    })
})

describe('normalizeSmsTemplates', () => {
    it('utilise les modèles par défaut si le champ est absent', () => {
        expect(normalizeSmsTemplates(undefined).map((t) => t.id)).toEqual(
            DEFAULT_SMS_TEMPLATES.map((t) => t.id)
        )
    })

    it('conserve une liste vide enregistrée', () => {
        expect(normalizeSmsTemplates([])).toEqual([])
    })

    it('ignore les modèles sans titre ni texte', () => {
        expect(
            normalizeSmsTemplates([
                { id: 'ok', title: 'A', body: 'B' },
                { id: 'empty', title: '  ', body: '   ' },
            ])
        ).toEqual([{ id: 'ok', title: 'A', body: 'B' }])
    })
})

describe('buildSmsUrl', () => {
    it('ouvre Messages sans numéro', () => {
        expect(buildSmsUrl('Hello')).toBe('sms:?&body=Hello')
    })

    it('ajoute un numéro nettoyé sans le stocker', () => {
        expect(buildSmsUrl('Hello', '06 12 34 56 78')).toBe(
            'sms:0612345678?&body=Hello'
        )
    })
})

describe('cleanPhoneNumber', () => {
    it('garde le + et les chiffres', () => {
        expect(cleanPhoneNumber('+33 6 12-34')).toBe('+3361234')
    })
})
