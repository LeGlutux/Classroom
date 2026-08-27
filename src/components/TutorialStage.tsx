import React from 'react'
import addPage from '../images/addPage.png'
import home from '../images/home.png'
import list from '../images/list.png'
import up from '../images/up.png'
import down from '../images/down.png'
import {
    TutorialHighlight,
    TutorialScreen,
} from '../tutorial'
import {
    IconChevronRight,
    IconGrid,
    IconUpload,
    IconUser,
    IconUsers,
} from './Icons'
import { handleIcon } from '../functions'
import TutorialDemoCard from './TutorialDemoCard'

const navIconClass = (active: boolean) =>
    `self-center${active ? '' : ' nav-icon-inactive'}`

const FakeNav = ({
    active,
    highlight,
    onSettings,
}: {
    active: 'home' | 'settings'
    highlight?: TutorialHighlight
    onSettings?: () => void
}) => (
    <div className="flex flex-row px-4 h-full justify-around py-2">
        <button
            type="button"
            className={`rounded-full h-8 w-8 flex justify-center items-center tutorial-fake-nav-btn${
                highlight === 'nav-settings' ? ' tutorial-lit' : ''
            }`}
            onClick={onSettings}
            aria-label="Paramètres"
        >
            <img
                className={navIconClass(active === 'settings')}
                src={addPage}
                alt=""
            />
        </button>
        <span className="rounded-full h-8 w-8 flex justify-center items-center">
            <img
                className={navIconClass(active === 'home')}
                src={home}
                alt=""
            />
        </span>
        <span
            className={`rounded-full h-8 w-8 flex justify-center items-center tutorial-fake-nav-btn${
                highlight === 'nav-lists' ? ' tutorial-lit' : ''
            }`}
        >
            <img className="nav-icon-inactive" src={list} alt="" />
        </span>
    </div>
)

const FakeRow = ({
    icon,
    title,
    subtitle,
    lit,
    onClick,
}: {
    icon: React.ReactNode
    title: string
    subtitle: string
    lit?: boolean
    onClick?: () => void
}) => {
    const className = `settings-row${lit ? ' tutorial-lit' : ''}`
    const content = (
        <React.Fragment>
            <span className="settings-row-icon">{icon}</span>
            <span className="settings-row-body">
                <span className="settings-row-title">{title}</span>
                <span className="settings-row-sub">{subtitle}</span>
            </span>
            <IconChevronRight className="settings-row-chevron" />
        </React.Fragment>
    )
    if (onClick) {
        return (
            <button type="button" className={className} onClick={onClick}>
                {content}
            </button>
        )
    }
    return <div className={className}>{content}</div>
}

const FakeSettings = ({
    highlight,
    onCrosses,
}: {
    highlight?: TutorialHighlight
    onCrosses?: () => void
}) => (
    <div className="tutorial-fake-body">
        <div className="settings-group-label">Classes et élèves</div>
        <div className="settings-group">
            <div className={highlight === 'classes' ? 'tutorial-lit' : ''}>
                <FakeRow
                    icon={<IconUpload />}
                    title="Importer depuis Pronote"
                    subtitle="À partir d’un export CSV"
                />
                <FakeRow
                    icon={<IconUsers />}
                    title="Créer une classe manuellement"
                    subtitle="Une classe à la fois"
                />
                <FakeRow
                    icon={<IconUser />}
                    title="Ajouter des élèves manuellement"
                    subtitle="Un élève à la fois, dans une classe"
                />
            </div>
            <FakeRow
                icon={<IconGrid />}
                title="Personnaliser les croix"
                subtitle="Croix négatives et positives"
                lit={highlight === 'crosses-row'}
                onClick={onCrosses}
            />
        </div>
    </div>
)

const FakeCrossBlock = ({
    title,
    icons,
}: {
    title: string
    icons: number[]
}) => (
    <div className="cross-customize-block">
        <div className="settings-group-label">{title}</div>
        <div className="student-card cross-customize-card">
            <div className="flex justify-between flex-col">
                <div className="flex flex-row">
                    <div className="font-studentName ml-2 mt-2 text-gray-900 font-medium text-xl leading-none">
                        Pat
                    </div>
                    <div className="font-studentName ml-2 mt-2 text-gray-900 font-bold text-xl leading-none">
                        Mercier
                    </div>
                </div>
                <div className="w-full h-24 flex p-2 content-center justify-between pr-6">
                    {icons.map((icon) => (
                        <div key={icon} className="flex flex-col">
                            <span className="flex flex-row justify-center mb-1">
                                <img className="h-5 w-5" src={up} alt="" />
                            </span>
                            <div className="w-8 h-8 rounded-full">
                                <img src={handleIcon(icon)} alt="" />
                            </div>
                            <span className="flex flex-row justify-center mt-2">
                                <img className="h-5 w-5" src={down} alt="" />
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
)

const FakeCrosses = ({ highlight }: { highlight?: TutorialHighlight }) => (
    <div
        className={`tutorial-fake-body${
            highlight === 'crosses' ? ' tutorial-lit' : ''
        }`}
    >
        <p className="settings-panel-note">
            Croix négatives (oubli de matériel) et croix positives (bonne
            séance).
        </p>
        <FakeCrossBlock title="Croix négatives" icons={[1, 2, 13]} />
        <FakeCrossBlock title="Croix positives" icons={[16, 11]} />
    </div>
)

const FakeHome = ({
    highlight,
    demo,
}: {
    highlight?: TutorialHighlight
    demo?: 'card' | 'swipe'
}) => (
    <div className="tutorial-fake-body">
        {demo ? (
            <TutorialDemoCard
                swipe={demo === 'swipe'}
                interactive={highlight === 'demo-cross' || highlight === 'demo-note'}
                focus={
                    highlight === 'demo-i' ||
                    highlight === 'demo-cross' ||
                    highlight === 'demo-note' ||
                    highlight === 'demo-card'
                        ? highlight
                        : undefined
                }
            />
        ) : (
            <div className="tutorial-fake-home-empty">
                <div className="empty-title">Accueil</div>
                <div className="empty-text">
                    Vos classes apparaîtront ici, une fois créées.
                </div>
            </div>
        )}
    </div>
)

const TutorialStage = ({
    stage,
    highlight,
    demo,
    onAdvance,
    children,
}: {
    stage: TutorialScreen
    highlight?: TutorialHighlight
    demo?: 'card' | 'swipe'
    onAdvance: () => void
    children?: React.ReactNode
}) => {
    const header =
        stage === 'settings'
            ? 'Paramètres'
            : stage === 'crosses'
            ? 'Personnaliser les croix'
            : 'Accueil'
    const navActive = stage === 'home' ? 'home' : 'settings'

    return (
        <div className="tutorial-stage">
            <div className="flex-shrink-0 relative flex flex-row w-full h-12 page-header items-center justify-center">
                <span className="page-header-title">{header}</span>
            </div>
            {stage === 'settings' ? (
                <FakeSettings
                    highlight={highlight}
                    onCrosses={
                        highlight === 'crosses-row' ? onAdvance : undefined
                    }
                />
            ) : stage === 'crosses' ? (
                <FakeCrosses highlight={highlight} />
            ) : (
                <FakeHome highlight={highlight} demo={demo} />
            )}
            {children}
            <div className="flex-shrink-0 w-full h-12 nav-wrap">
                <FakeNav
                    active={navActive}
                    highlight={highlight}
                    onSettings={
                        highlight === 'nav-settings' ? onAdvance : undefined
                    }
                />
            </div>
        </div>
    )
}

export default TutorialStage
