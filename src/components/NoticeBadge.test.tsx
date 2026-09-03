import React from 'react'
import { render } from '@testing-library/react'
import { NoticeBadge } from './NoticeBadge'

describe('NoticeBadge', () => {
    it('ne rend rien sans signalement', () => {
        const { container } = render(<NoticeBadge count={0} />)
        expect(container.firstChild).toBeNull()
    })

    it('affiche le nombre, plafonné à 9+', () => {
        const { getByLabelText, rerender } = render(<NoticeBadge count={3} />)
        expect(getByLabelText('3 nouveaux signalements').textContent).toBe('3')
        rerender(<NoticeBadge count={12} />)
        expect(getByLabelText('12 nouveaux signalements').textContent).toBe('9+')
    })
})
