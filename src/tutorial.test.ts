import {
    TUTORIAL_REPLAY_EVENT,
    getTutorialSteps,
    replayTutorial,
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

describe('replayTutorial', () => {
    it('envoie l’événement qui ouvre la visite guidée', () => {
        const onReplay = jest.fn()
        window.addEventListener(TUTORIAL_REPLAY_EVENT, onReplay)
        replayTutorial()
        expect(onReplay).toHaveBeenCalledTimes(1)
        window.removeEventListener(TUTORIAL_REPLAY_EVENT, onReplay)
    })
})

describe('getTutorialSteps', () => {
    it('inclut le SMS seulement si la fonction est disponible', () => {
        const withoutSms = getTutorialSteps(false).map((step) => step.id)
        const withSms = getTutorialSteps(true).map((step) => step.id)
        expect(withoutSms).toEqual([
            'welcome',
            'classes-nav',
            'classes',
            'crosses-nav',
            'crosses',
            'cards-i',
            'cards-cross',
            'cards-note',
            'lists',
            'ready',
        ])
        expect(withSms).toEqual([
            'welcome',
            'classes-nav',
            'classes',
            'crosses-nav',
            'crosses',
            'cards-i',
            'cards-cross',
            'cards-note',
            'cards-sms',
            'lists',
            'ready',
        ])
    })

    it('emmène vers Paramètres puis la personnalisation des croix', () => {
        const steps = getTutorialSteps(false)
        const nav = steps.find((step) => step.id === 'classes-nav')
        const classes = steps.find((step) => step.id === 'classes')
        const crossesNav = steps.find((step) => step.id === 'crosses-nav')
        const crosses = steps.find((step) => step.id === 'crosses')
        expect(nav && nav.spot).toBe('nav-settings')
        expect(nav && nav.advanceOnSpotClick).toBe(true)
        expect(classes && classes.route).toBe('/create')
        expect(classes && classes.spot).toBe('classes')
        expect(crossesNav && crossesNav.spot).toBe('crosses-row')
        expect(crosses && crosses.route).toBe('/create/cartes')
        expect(crosses && crosses.body).toMatch(/négatives/)
        expect(crosses && crosses.body).toMatch(/positives/)
        expect(crosses && crosses.body).toMatch(/oubli de matériel/)
        expect(crosses && crosses.body).toMatch(/bonne séance/)
    })

    it('présente Pat Mercier sur l’accueil, sans aller dans les listes', () => {
        const steps = getTutorialSteps(true)
        const card = steps.find((step) => step.id === 'cards-i')
        const sms = steps.find((step) => step.id === 'cards-sms')
        const lists = steps.find((step) => step.id === 'lists')
        expect(card && card.demo).toBe('card')
        expect(card && card.route).toBe('/')
        expect(card && card.body).toMatch(/Pat Mercier/)
        expect(sms && sms.demo).toBe('swipe')
        expect(sms && sms.body).toMatch(/droite/)
        expect(sms && sms.body).not.toMatch(/gauche/)
        expect(lists && lists.route).toBeUndefined()
        expect(lists && lists.body).toMatch(/document/)
        expect(lists && lists.body).toMatch(/évaluation/)
    })

    it('parle de visite guidée, pas de tour', () => {
        const welcome = getTutorialSteps(false)[0]
        expect(welcome.body).toMatch(/visite guidée/)
        expect(welcome.body).not.toMatch(/\btour\b/)
    })

    it('garde un titre et un texte sur chaque écran', () => {
        getTutorialSteps(true).forEach((step) => {
            expect(step.title.length).toBeGreaterThan(3)
            expect(step.body.length).toBeGreaterThan(20)
        })
    })
})
