import React from 'react'
import { render } from '@testing-library/react'
import { SessionSummaryStrip } from './SessionSummaryBar'

jest.mock('../hooks', () => ({
    useSessionCrosses: () => [],
}))

describe('SessionSummaryStrip', () => {
    it('affiche logo et nombre, sans rouge ni gras', () => {
        const { container, getByLabelText } = render(
            <SessionSummaryStrip
                items={[
                    { type: 'behaviour', src: 'behaviour.png', count: 0 },
                    { type: 'homework', src: 'homework.png', count: 1 },
                    { type: 'supply', src: 'supply.png', count: 2 },
                ]}
            />
        )
        expect(getByLabelText('Résumé de séance')).toBeTruthy()
        const counts = container.querySelectorAll('.session-summary-count')
        expect(counts[0].textContent).toBe('0')
        expect(counts[1].textContent).toBe('1')
        expect(counts[2].textContent).toBe('2')
        counts.forEach((node) => {
            expect(node.className).not.toMatch(/is-recent/)
            expect(node.className).not.toMatch(/is-multi/)
        })
        expect(container.querySelectorAll('img').length).toBe(3)
        expect(container.querySelector('.session-summary-bar')).toBeTruthy()
        expect(container.querySelector('.session-summary-dock')).toBeNull()
    })

    it('ne rend rien sans icônes', () => {
        const { container } = render(<SessionSummaryStrip items={[]} />)
        expect(container.firstChild).toBeNull()
    })
})
