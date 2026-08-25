export const TUTORIAL_REPLAY_EVENT = 'thotnote-replay-tutorial'

export type TutorialNav = 'settings' | 'home' | 'lists'

export type TutorialStepId =
    | 'welcome'
    | 'classes'
    | 'crosses'
    | 'cards'
    | 'lists'
    | 'sms'
    | 'ready'

export type TutorialStep = {
    id: TutorialStepId
    title: string
    body: string
    hint?: string
    nav?: TutorialNav
}

export type TutorialUser = {
    tutorialCompleted?: boolean
    classes?: string[] | null
}

export const replayTutorial = () => {
    if (typeof window === 'undefined') return
    window.dispatchEvent(new Event(TUTORIAL_REPLAY_EVENT))
}

export const shouldAutoStartTutorial = (user?: TutorialUser | null) => {
    if (!user) return false
    if (user.tutorialCompleted === true) return false
    const classes = user.classes
    return !classes || !Array.isArray(classes) || classes.length === 0
}

export const getTutorialSteps = (showSms: boolean): TutorialStep[] => {
    const steps: TutorialStep[] = [
        {
            id: 'welcome',
            title: 'Bienvenue sur Thòt Note',
            body:
                'Votre cahier de classe, dans la poche. Quelques écrans suffisent pour la visite guidée. Vous pourrez la rejouer plus tard depuis Paramètres.',
        },
        {
            id: 'classes',
            title: 'Ajouter des classes',
            body:
                'L’icône de gauche, en bas, ouvre Paramètres. Importez un export Pronote, ou créez une classe puis des élèves à la main.',
            hint: 'C’est l’icône entourée en vert, en bas à gauche.',
            nav: 'settings',
        },
        {
            id: 'crosses',
            title: 'Personnaliser les croix',
            body:
                'Toujours dans Paramètres, ouvrez « Personnaliser les croix ». Choisissez les icônes (travail, comportement, positif…) : c’est le geste du quotidien. Un appui pose une croix, un appui long la retire.',
            hint: 'Paramètres, puis Personnaliser les croix.',
            nav: 'settings',
        },
        {
            id: 'cards',
            title: 'Les cartes élèves',
            body:
                'Sur l’accueil, chaque élève a une carte avec vos croix. Le crayon sous la carte sert à une note courte. L’icône « i » ouvre le détail de l’élève.',
            nav: 'home',
        },
        {
            id: 'lists',
            title: 'Les listes',
            body:
                'L’icône de droite, en bas, ouvre les listes : absents, oubli de travail, etc. Créez une liste, puis cochez les élèves concernés.',
            hint: 'C’est l’icône entourée en vert, en bas à droite.',
            nav: 'lists',
        },
    ]

    if (showSms) {
        steps.push({
            id: 'sms',
            title: 'SMS aux parents',
            body:
                'Glissez une carte vers la gauche pour choisir un modèle. Le prénom se copie : cherchez le contact sous la forme « 6A - Léa Dupont ». Aucun numéro n’est enregistré dans Thòt Note.',
            nav: 'home',
        })
    }

    steps.push({
        id: 'ready',
        title: 'C’est à vous',
        body:
            'Quand vous êtes prêt, commencez par une classe, puis personnalisez vos croix. La visite guidée reste disponible dans Paramètres, groupe Aide.',
        nav: 'settings',
    })

    return steps
}
