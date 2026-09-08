import React from 'react'
import { render } from '@testing-library/react'
import { SessionSummaryStrip } from './SessionSummaryBar'

jest.mock('../hooks', () => ({
    useSessionCrosses: () => ({ crosses: [], ready: true }),
}))

describe('SessionSummaryStrip', () => {
    it('reste replié tant qu’il n’y a pas de croix', () => {
        const { container, queryByLabelText } = render(
            <SessionSummaryStrip items={[]} open={false} animated />
        )
        expect(container.querySelector('.session-summary-fold.is-open')).toBeNull()
        expect(queryByLabelText('Résumé de séance')).toBeNull()
    })

    it('affiche au centre les logos une fois ouvert', () => {
        const { container, getByLabelText } = render(
            <SessionSummaryStrip
                open
                animated
                items={[
                    { type: 'homework', src: 'homework.png', count: 1 },
                    { type: 'supply', src: 'supply.png', count: 2 },
                ]}
            />
        )
        expect(getByLabelText('Résumé de séance')).toBeTruthy()
        expect(container.querySelector('.session-summary-fold.is-open')).toBeTruthy()
        const counts = container.querySelectorAll('.session-summary-count')
        expect(counts[0].textContent).toBe('1')
        expect(counts[1].textContent).toBe('2')
        expect(container.querySelectorAll('img').length).toBe(2)
    })
})
