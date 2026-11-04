export const TUTORIAL_REPLAY_EVENT = 'thotnote-replay-tutorial'
export const TUTORIAL_NEGATIVE_ICONS = [1, 2, 13]
export const TUTORIAL_POSITIVE_ICONS = [16, 11]

export const TUTORIAL_DEMO_STUDENT = {
    surname: 'Amandine',
    name: 'Mizab',
}

export type TutorialStudent = {
    id: string
    surname: string
    name: string
}

export const TUTORIAL_CLASS: TutorialStudent[] = [
    { id: 'amandine', surname: 'Amandine', name: 'Mizab' },
    { id: 'lea-d', surname: 'Léa', name: 'Dupont' },
    { id: 'lea-m', surname: 'Léa', name: 'Martin' },
    { id: 'noah', surname: 'Noah', name: 'Petit' },
    { id: 'ines', surname: 'Inès', name: 'Bernard' },
    { id: 'hugo', surname: 'Hugo', name: 'Lambert' },
    { id: 'chloe', surname: 'Chloé', name: 'Moreau' },
    { id: 'yanis', surname: 'Yanis', name: 'Roux' },
    { id: 'emma', surname: 'Emma', name: 'Garcia' },
    { id: 'louis', surname: 'Louis', name: 'Morel' },
    { id: 'sarah', surname: 'Sarah', name: 'Nguyen' },
    { id: 'theo', surname: 'Théo', name: 'Fournier' },
]

export const TUTORIAL_LIST_STUDENTS: TutorialStudent[] = [
    TUTORIAL_CLASS[0],
    TUTORIAL_CLASS[1],
    TUTORIAL_CLASS[2],
    { id: 'chris', surname: 'Christophe', name: 'Bernard' },
    TUTORIAL_CLASS[3],
]

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
    | 'periodes'
    | 'more'

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
    | 'periodes'

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
            body: 'Ouvrez « Personnaliser les croix ».',
            stage: 'settings',
            highlight: 'crosses-row',
            advanceOnHighlight: true,
        },
        {
            id: 'crosses',
            title: 'Croix négatives et positives',
            body:
                'Choisissez les icônes qui apparaîtront sur les fiches élèves : négatives (oubli de matériel, travail non fait…) ou positives (bonne séance, effort…).',
            stage: 'crosses',
            highlight: 'crosses',
        },
        {
            id: 'cards-i',
            title: 'Les cartes élèves',
            body:
                'Voici la carte d’une élève. C’est ici que les icônes choisies apparaîtront. Le « i » ouvre le détail de l’élève : historique des croix, notes, évolution.',
            stage: 'home',
            highlight: 'demo-i',
            demo: 'card',
        },
        {
            id: 'cards-cross',
            title: 'Poser et retirer une croix',
            body:
                'Un appui sur une icône ajoute une croix. Un appui long la retire. C’est le geste du quotidien. Vous pouvez essayer sur la carte d’Amandine.',
            stage: 'home',
            highlight: 'demo-cross',
            demo: 'card',
        },
        {
            id: 'cards-note',
            title: 'Une note sous la fiche',
            body:
                'Le crayon sous la carte sert à une note courte, visible d’un coup d’œil (PAP, rdv parents…).',
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
                'Glissez une carte vers la droite pour choisir un modèle. Vous pourrez ensuite accéder à vos contacts si le numéro est déjà enregistré dans votre téléphone.',
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
                'Le cadenas est ouvert, vous pouvez placer les élèves comme vous le souhaitez. Appuyez sur le rectangle blanc pour ajouter une table vide. Quand le cadenas est fermé, appuyer sur un élève ouvre sa carte.',
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
                'Un appui change la couleur de la case. Un appui long la remet à vide. L’en-tête trie. Vous pouvez essayer.',
            stage: 'lists',
        },
        {
            id: 'periodes',
            title: 'Nouvelle période',
            body:
                'À la fin d’une période ou d’un trimestre, vous pouvez réinitialiser les croix tout en les gardant en mémoire, ça se passe ici.',
            stage: 'settings',
            highlight: 'periodes',
        },
        {
            id: 'more',
            title: 'D’autres choses à découvrir',
            body:
                'Dans les paramètres il reste d’autres choses à découvrir comme le podium ou la personnalisation des couleurs. À vous d’essayer.',
            stage: 'settings',
        }
    )

    return steps
}
