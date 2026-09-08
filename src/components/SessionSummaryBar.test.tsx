import React from 'react'
import { render } from '@testing-library/react'
import { SessionSummaryStrip } from './SessionSummaryBar'

jest.mock('../hooks', () => ({
    useSessionCrosses: () => [],
}))

describe('SessionSummaryStrip', () => {
    it('affiche logo et nombre, rouge dès 1, gras dès 2', () => {
        const { container, getByLabelText } = render(
            <SessionSummaryStrip
                items={[
                    {
                        type: 'behaviour',
                        src: 'behaviour.png',
                        count: 0,
                        recent: false,
                        bold: false,
                    },
                    {
                        type: 'homework',
                        src: 'homework.png',
                        count: 1,
                        recent: true,
                        bold: false,
                    },
                    {
                        type: 'supply',
                        src: 'supply.png',
                        count: 2,
                        recent: true,
                        bold: true,
                    },
                ]}
            />
        )
        expect(getByLabelText('Résumé de séance')).toBeTruthy()
        const counts = container.querySelectorAll('.session-summary-count')
        expect(counts[0].textContent).toBe('0')
        expect(counts[0].className).not.toMatch(/is-recent/)
        expect(counts[1].textContent).toBe('1')
        expect(counts[1].className).toMatch(/is-recent/)
        expect(counts[1].className).not.toMatch(/is-multi/)
        expect(counts[2].textContent).toBe('2')
        expect(counts[2].className).toMatch(/is-recent/)
        expect(counts[2].className).toMatch(/is-multi/)
        expect(container.querySelectorAll('img').length).toBe(3)
    })
})
