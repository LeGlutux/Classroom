import {
    TUTORIAL_COMPLETED_EVENT,
    TUTORIAL_REPLAY_EVENT,
    getTutorialSteps,
    notifyTutorialCompleted,
    replayTutorial,
    tutorialNeverPlayed,
} from './tutorial'

describe('tutorialNeverPlayed', () => {
    it('reste vrai tant que le tutoriel n’est pas marqué comme vu', () => {
        expect(tutorialNeverPlayed(undefined)).toBe(true)
        expect(tutorialNeverPlayed(null)).toBe(true)
        expect(tutorialNeverPlayed({})).toBe(true)
        expect(tutorialNeverPlayed({ tutorialCompleted: false })).toBe(true)
        expect(tutorialNeverPlayed({ classes: ['6A'] })).toBe(true)
    })

    it('devient faux une fois le tutoriel terminé', () => {
        expect(
            tutorialNeverPlayed({
                classes: [],
                tutorialCompleted: true,
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

    it('signale la fin de la visite guidée', () => {
        const onDone = jest.fn()
        window.addEventListener(TUTORIAL_COMPLETED_EVENT, onDone)
        notifyTutorialCompleted()
        expect(onDone).toHaveBeenCalledTimes(1)
        window.removeEventListener(TUTORIAL_COMPLETED_EVENT, onDone)
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
        expect(nav && nav.stage).toBe('home')
        expect(nav && nav.highlight).toBe('nav-settings')
        expect(nav && nav.advanceOnHighlight).toBe(true)
        expect(classes && classes.stage).toBe('settings')
        expect(classes && classes.highlight).toBe('classes')
        expect(crossesNav && crossesNav.highlight).toBe('crosses-row')
        expect(crosses && crosses.stage).toBe('crosses')
        expect(crosses && crosses.body).toMatch(/négatives/)
        expect(crosses && crosses.body).toMatch(/positives/)
        expect(crosses && crosses.body).toMatch(/oubli de matériel/)
        expect(crosses && crosses.body).toMatch(/bonne séance/)
        expect(crosses && crosses.body).not.toMatch(/appui/)
        const tryCross = steps.find((step) => step.id === 'cards-cross')
        expect(tryCross && tryCross.body).toMatch(/appui/)
    })

    it('présente Pat Mercier sur l’accueil, sans aller dans les listes', () => {
        const steps = getTutorialSteps(true)
        const card = steps.find((step) => step.id === 'cards-i')
        const sms = steps.find((step) => step.id === 'cards-sms')
        const lists = steps.find((step) => step.id === 'lists')
        expect(card && card.demo).toBe('card')
        expect(card && card.stage).toBe('home')
        expect(card && card.body).toMatch(/Pat Mercier/)
        expect(sms && sms.demo).toBe('swipe')
        expect(sms && sms.body).toMatch(/droite/)
        expect(sms && sms.body).not.toMatch(/gauche/)
        expect(lists && lists.stage).toBe('home')
        expect(lists && lists.highlight).toBe('nav-lists')
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
