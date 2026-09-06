import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import TutorialFakeApp from './TutorialStage'

describe('TutorialFakeApp plan et listes', () => {
    it('montre deux tables de deux, avec les hints d’homonymes', () => {
        const { getByText, getByLabelText, queryByLabelText } = render(
            <TutorialFakeApp stage="plan" onAdvance={() => undefined} />
        )
        expect(getByText('Plan de classe')).toBeTruthy()
        expect(getByText('Pat')).toBeTruthy()
        expect(getByText('Dup')).toBeTruthy()
        expect(getByText('Mar')).toBeTruthy()
        expect(getByLabelText('Pat Mercier')).toBeTruthy()
        expect(getByLabelText('Noah Petit')).toBeTruthy()
        expect(queryByLabelText('Cadre vide')).toBeNull()
        expect(queryByLabelText('Ajouter un cadre vide')).toBeNull()
    })

    it('affiche le prénom, et les trois lettres seulement en cas de doublon', () => {
        const { getByText } = render(
            <TutorialFakeApp stage="lists" onAdvance={() => undefined} />
        )
        expect(getByText('Évaluation')).toBeTruthy()
        expect(getByText('Pat')).toBeTruthy()
        expect(getByText('Léa Dup')).toBeTruthy()
        expect(getByText('Léa Mar')).toBeTruthy()
        expect(getByText('Christophe')).toBeTruthy()
        expect(getByText('Noah')).toBeTruthy()
    })

    it('range les croix dans Personnalisation sur le faux écran Paramètres', () => {
        const { getByText } = render(
            <TutorialFakeApp
                stage="settings"
                highlight="crosses-row"
                onAdvance={() => undefined}
            />
        )
        expect(getByText('Personnalisation')).toBeTruthy()
        expect(getByText('Personnaliser les croix')).toBeTruthy()
        expect(getByText('Personnaliser les couleurs élèves')).toBeTruthy()
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
