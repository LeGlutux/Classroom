import {
    getTutorialSteps,
    shouldAutoStartTutorial,
} from './tutorial'

describe('shouldAutoStartTutorial', () => {
    it('ne démarre pas sans document utilisateur', () => {
        expect(shouldAutoStartTutorial(undefined)).toBe(false)
        expect(shouldAutoStartTutorial(null)).toBe(false)
    })

    it('démarre pour un compte neuf, sans classes', () => {
        expect(shouldAutoStartTutorial({ classes: [], tutorialCompleted: false })).toBe(
            true
        )
        expect(shouldAutoStartTutorial({ classes: [] })).toBe(true)
        expect(shouldAutoStartTutorial({})).toBe(true)
    })

    it('ne relance pas un compte qui a déjà vu le tutoriel', () => {
        expect(
            shouldAutoStartTutorial({
                classes: [],
                tutorialCompleted: true,
            })
        ).toBe(false)
    })

    it('ne s’impose pas aux comptes qui ont déjà des classes', () => {
        expect(shouldAutoStartTutorial({ classes: ['6A'] })).toBe(false)
        expect(
            shouldAutoStartTutorial({
                classes: ['6A'],
                tutorialCompleted: false,
            })
        ).toBe(false)
    })
})

describe('getTutorialSteps', () => {
    it('inclut le SMS seulement si la fonction est disponible', () => {
        const withoutSms = getTutorialSteps(false).map((step) => step.id)
        const withSms = getTutorialSteps(true).map((step) => step.id)
        expect(withoutSms).toEqual([
            'welcome',
            'classes',
            'crosses',
            'cards',
            'lists',
            'ready',
        ])
        expect(withSms).toEqual([
            'welcome',
            'classes',
            'crosses',
            'cards',
            'lists',
            'sms',
            'ready',
        ])
    })

    it('place la personnalisation des croix avant les cartes élèves', () => {
        const ids = getTutorialSteps(false).map((step) => step.id)
        expect(ids.indexOf('crosses')).toBeLessThan(ids.indexOf('cards'))
        expect(getTutorialSteps(false)[2].title).toMatch(/croix/i)
    })

    it('parle de visite guidée, pas de tour', () => {
        const welcome = getTutorialSteps(false)[0]
        expect(welcome.body).toMatch(/visite guidée/)
        expect(welcome.body).not.toMatch(/\btour\b/)
    })

    it('indique un swipe vers la droite pour le SMS', () => {
        const sms = getTutorialSteps(true).find((step) => step.id === 'sms')
        expect(sms && sms.body).toMatch(/droite/)
        expect(sms && sms.body).not.toMatch(/gauche/)
    })

    it('garde un titre et un texte sur chaque écran', () => {
        getTutorialSteps(true).forEach((step) => {
            expect(step.title.length).toBeGreaterThan(3)
            expect(step.body.length).toBeGreaterThan(20)
        })
    })
})
