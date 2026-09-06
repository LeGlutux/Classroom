export const TUTORIAL_REPLAY_EVENT = 'thotnote-replay-tutorial'
export const TUTORIAL_NEGATIVE_ICONS = [1, 2, 13]
export const TUTORIAL_POSITIVE_ICONS = [16, 11]

export type TutorialStepId =
    | 'welcome'
    | 'classes-nav'
    | 'classes'
    | 'crosses-nav'
    | 'crosses'
    | 'cards-i'
    | 'cards-cross'
    | 'cards-note'
    | 'cards-sms'
    | 'plan-nav'
    | 'plan'
    | 'lists-nav'
    | 'lists'
    | 'ready'

export type TutorialScreen = 'home' | 'settings' | 'crosses' | 'plan' | 'lists'

export type TutorialHighlight =
    | 'nav-settings'
    | 'classes'
    | 'crosses-row'
    | 'crosses'
    | 'demo-i'
    | 'demo-cross'
    | 'demo-note'
    | 'demo-card'
    | 'nav-plan'
    | 'nav-lists'

export type TutorialStep = {
    id: TutorialStepId
    title: string
    body: string
    hint?: string
    stage?: TutorialScreen
    highlight?: TutorialHighlight
    advanceOnHighlight?: boolean
    demo?: 'card' | 'swipe'
}

export type TutorialUser = {
    tutorialCompleted?: boolean
    classes?: string[] | null
}

export const TUTORIAL_COMPLETED_EVENT = 'thotnote-tutorial-completed'

export const replayTutorial = () => {
    if (typeof window === 'undefined') return
    window.dispatchEvent(new Event(TUTORIAL_REPLAY_EVENT))
}

export const notifyTutorialCompleted = () => {
    if (typeof window === 'undefined') return
    window.dispatchEvent(new Event(TUTORIAL_COMPLETED_EVENT))
}

export const tutorialNeverPlayed = (user?: TutorialUser | null) =>
    !user || user.tutorialCompleted !== true

export const getTutorialSteps = (showSms: boolean): TutorialStep[] => {
    const steps: TutorialStep[] = [
        {
            id: 'welcome',
            title: 'Bienvenue sur Thòt Note',
            body:
                'Votre cahier de classe, dans la poche. Quelques écrans suffisent pour la visite guidée. Vous pourrez la rejouer plus tard depuis Paramètres.',
        },
        {
            id: 'classes-nav',
            title: 'Ajouter des classes',
            body:
                'L’icône de gauche, en bas, ouvre Paramètres. Appuyez dessus pour y aller.',
            hint: 'C’est l’icône entourée, en bas à gauche.',
            stage: 'home',
            highlight: 'nav-settings',
            advanceOnHighlight: true,
        },
        {
            id: 'classes',
            title: 'Ajouter des classes',
            body:
                'Importez un export Pronote, ou créez une classe puis des élèves à la main.',
            stage: 'settings',
            highlight: 'classes',
        },
        {
            id: 'crosses-nav',
            title: 'Personnaliser les croix',
            body:
                'Toujours dans Paramètres, groupe Personnalisation, ouvrez « Personnaliser les croix ».',
            stage: 'settings',
            highlight: 'crosses-row',
            advanceOnHighlight: true,
        },
        {
            id: 'crosses',
            title: 'Croix négatives et positives',
            body:
                'Choisissez les icônes : négatives (oubli de matériel, travail non fait…) et positives (bonne séance, effort…).',
            stage: 'crosses',
            highlight: 'crosses',
        },
        {
            id: 'cards-i',
            title: 'Les cartes élèves',
            body:
                'Voici la carte de Pat Mercier. Le « i » ouvre le détail de l’élève : historique des croix, notes, évolution.',
            stage: 'home',
            highlight: 'demo-i',
            demo: 'card',
        },
        {
            id: 'cards-cross',
            title: 'Poser et retirer une croix',
            body:
                'Un appui sur une icône pose une croix. Un appui long la retire. C’est le geste du quotidien. Vous pouvez essayer sur la carte de Pat.',
            stage: 'home',
            highlight: 'demo-cross',
            demo: 'card',
        },
        {
            id: 'cards-note',
            title: 'Une note sous la fiche',
            body:
                'Le crayon sous la carte sert à une note courte, visible d’un coup d’œil (oubli de cahier, mot des parents…).',
            stage: 'home',
            highlight: 'demo-note',
            demo: 'card',
        },
    ]

    if (showSms) {
        steps.push({
            id: 'cards-sms',
            title: 'SMS aux parents',
            body:
                'Glissez une carte vers la droite pour choisir un modèle. Le prénom se copie : cherchez le contact sous la forme « 6A - Pat Mercier ». Aucun numéro n’est enregistré dans Thòt Note.',
            stage: 'home',
            highlight: 'demo-card',
            demo: 'swipe',
        })
    }

    steps.push(
        {
            id: 'plan-nav',
            title: 'Le plan de classe',
            body:
                'L’icône à côté de l’accueil ouvre le plan de classe. Appuyez dessus pour y aller.',
            hint: 'C’est l’icône entourée, en bas.',
            stage: 'home',
            highlight: 'nav-plan',
            advanceOnHighlight: true,
        },
        {
            id: 'plan',
            title: 'Le plan de classe',
            body:
                'Vous placez les élèves comme vous voulez.',
            stage: 'plan',
        },
        {
            id: 'lists-nav',
            title: 'Les listes',
            body:
                'L’icône de droite, en bas, ouvre les listes : documents, signatures, évaluations. Appuyez dessus pour y aller.',
            hint: 'C’est l’icône entourée, en bas à droite.',
            stage: 'plan',
            highlight: 'nav-lists',
            advanceOnHighlight: true,
        },
        {
            id: 'lists',
            title: 'Cocher les élèves',
            body:
                'Un appui fait tourner la case. Un appui long la remet à vide, sans toute la rotation. L’en-tête trie. Vous pouvez essayer.',
            stage: 'lists',
        },
        {
            id: 'ready',
            title: 'C’est à vous',
            body:
                'Quand vous êtes prêt, commencez par une classe, puis personnalisez vos croix. La visite guidée reste disponible dans Paramètres, groupe Aide.',
        }
    )

    return steps
}
