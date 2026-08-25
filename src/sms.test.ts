import {
    SMS_TOKEN,
    buildSmsUrl,
    cleanPhoneNumber,
    DEFAULT_SMS_TEMPLATES,
    fillSmsTemplate,
    formatSmsDate,
    insertSmsToken,
    normalizeSmsTemplates,
} from './sms'

describe('fillSmsTemplate', () => {
    const student = {
        prenom: 'Léa',
        nom: 'Dupont',
        classe: '6A',
        crossCounts: { homework: 3, behaviour: 0 },
    }
    const now = new Date(2026, 7, 25)

    it('remplace les jetons #', () => {
        expect(
            fillSmsTemplate(
                'Bonjour, #prénom #nom en #classe, #x-homework croix.',
                student,
                now
            )
        ).toBe('Bonjour, Léa Dupont en 6A, 3 croix.')
    })

    it('accepte encore les anciens {prénom}', () => {
        expect(
            fillSmsTemplate('Bonjour, {prénom} {nom} en {classe}.', student)
        ).toBe('Bonjour, Léa Dupont en 6A.')
    })

    it('remplace #date', () => {
        expect(fillSmsTemplate('Le #date', student, now)).toBe(
            'Le ' + formatSmsDate(now)
        )
    })

    it('met 0 si la croix n’est pas dans les compteurs', () => {
        expect(fillSmsTemplate('#x-phone', student)).toBe('0')
    })
})

describe('insertSmsToken', () => {
    it('insère au curseur', () => {
        expect(insertSmsToken('Hello  !', SMS_TOKEN.prenom, 6, 6)).toEqual({
            body: 'Hello #prénom !',
            cursor: 6 + SMS_TOKEN.prenom.length,
        })
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
