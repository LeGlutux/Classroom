import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import TutorialFakeApp from './TutorialStage'

describe('TutorialFakeApp plan et listes', () => {
    it('montre un plan de 12 élèves, cadenas ouvert et cadre vide', () => {
        const { getByText, getByLabelText, queryByLabelText } = render(
            <TutorialFakeApp stage="plan" onAdvance={() => undefined} />
        )
        expect(getByText('Plan de classe')).toBeTruthy()
        expect(getByLabelText('Amandine Mizab')).toBeTruthy()
        expect(getByLabelText('Léa Dupont')).toBeTruthy()
        expect(getByLabelText('Léa Martin')).toBeTruthy()
        expect(getByLabelText('Théo Fournier')).toBeTruthy()
        expect(getByText('Amandine')).toBeTruthy()
        expect(getByText('Dup')).toBeTruthy()
        expect(getByText('Mar')).toBeTruthy()
        expect(getByLabelText('Ajouter un cadre vide')).toBeTruthy()
        expect(getByLabelText('Verrouiller le plan')).toBeTruthy()
        expect(queryByLabelText('Cadre vide')).toBeNull()
        fireEvent.click(getByLabelText('Ajouter un cadre vide'))
        expect(getByLabelText('Cadre vide')).toBeTruthy()
    })

    it('ouvre une carte fictive quand le cadenas est fermé', () => {
        const { getByLabelText, getByText } = render(
            <TutorialFakeApp stage="plan" onAdvance={() => undefined} />
        )
        fireEvent.click(getByLabelText('Verrouiller le plan'))
        fireEvent.click(getByLabelText('Amandine Mizab'))
        expect(getByText('Mizab')).toBeTruthy()
        expect(getByLabelText('Fermer')).toBeTruthy()
    })

    it('affiche le prénom, et les trois lettres seulement en cas de doublon', () => {
        const { getByText } = render(
            <TutorialFakeApp stage="lists" onAdvance={() => undefined} />
        )
        expect(getByText('Évaluation')).toBeTruthy()
        expect(getByText('Amandine')).toBeTruthy()
        expect(getByText('Léa Dup')).toBeTruthy()
        expect(getByText('Léa Mar')).toBeTruthy()
        expect(getByText('Christophe')).toBeTruthy()
        expect(getByText('Noah')).toBeTruthy()
    })

    it('montre la durée du suivi sur l’écran des croix', () => {
        const { getByText, getAllByText } = render(
            <TutorialFakeApp stage="crosses" onAdvance={() => undefined} />
        )
        expect(getByText('Durée du suivi des croix')).toBeTruthy()
        expect(getByText('2 h')).toBeTruthy()
        expect(getByText('Journée')).toBeTruthy()
        expect(getByText('2 h').className).toMatch(/is-on/)
        expect(getAllByText('Amandine').length).toBeGreaterThan(0)
        expect(getAllByText('Mizab').length).toBeGreaterThan(0)
    })

    it('range les croix dans Personnalisation et les périodes plus bas', () => {
        const { getByText, rerender } = render(
            <TutorialFakeApp
                stage="settings"
                highlight="crosses-row"
                onAdvance={() => undefined}
            />
        )
        expect(getByText('Personnalisation')).toBeTruthy()
        expect(getByText('Personnaliser les croix')).toBeTruthy()
        expect(getByText('Personnaliser les couleurs élèves')).toBeTruthy()
        expect(getByText('Personnaliser les SMS')).toBeTruthy()
        expect(getByText('Statistiques et podium')).toBeTruthy()
        rerender(
            <TutorialFakeApp
                stage="settings"
                highlight="periodes"
                onAdvance={() => undefined}
            />
        )
        expect(getByText('Périodes')).toBeTruthy()
        expect(getByText('Année')).toBeTruthy()
    })

    it('avance vers le plan ou les listes depuis la barre du bas', () => {
        const onAdvance = jest.fn()
        const { getByLabelText, rerender } = render(
            <TutorialFakeApp
                stage="home"
                highlight="nav-plan"
                onAdvance={onAdvance}
            />
        )
        fireEvent.click(getByLabelText('Plan de classe'))
        expect(onAdvance).toHaveBeenCalledTimes(1)
        rerender(
            <TutorialFakeApp
                stage="plan"
                highlight="nav-lists"
                onAdvance={onAdvance}
            />
        )
        fireEvent.click(getByLabelText('Listes'))
        expect(onAdvance).toHaveBeenCalledTimes(2)
    })
})
