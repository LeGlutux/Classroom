import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import TutorialFakeApp from './TutorialStage'

describe('TutorialFakeApp plan et listes', () => {
    it('montre les prénoms, les hints d’homonymes et un cadre vide', () => {
        const { getByText, getAllByLabelText, getByLabelText } = render(
            <TutorialFakeApp stage="plan" onAdvance={() => undefined} />
        )
        expect(getByText('Plan de classe')).toBeTruthy()
        expect(getByText('Pat')).toBeTruthy()
        expect(getByText('Dup')).toBeTruthy()
        expect(getByText('Mar')).toBeTruthy()
        expect(getAllByLabelText('Cadre vide').length).toBe(2)
        fireEvent.click(getByLabelText('Ajouter un cadre vide'))
        expect(getAllByLabelText('Cadre vide').length).toBe(3)
        fireEvent.click(getAllByLabelText('Retirer le cadre vide')[0])
        expect(getAllByLabelText('Cadre vide').length).toBe(2)
    })

    it('affiche le prénom en premier et les trois lettres en cas de doublon', () => {
        const { getByText } = render(
            <TutorialFakeApp stage="lists" onAdvance={() => undefined} />
        )
        expect(getByText('Évaluation')).toBeTruthy()
        expect(getByText('Pat Mercier')).toBeTruthy()
        expect(getByText('Léa Dup')).toBeTruthy()
        expect(getByText('Léa Mar')).toBeTruthy()
        expect(getByText('Christophe')).toBeTruthy()
        expect(getByText('Noah Petit')).toBeTruthy()
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
