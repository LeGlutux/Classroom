import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import CardCustomer from './CardCustomer'

const mockUpdate = jest.fn()
const mockUseIcons = jest.fn()

jest.mock('../../hooks', () => ({
    useIcons: (...args: unknown[]) => mockUseIcons(...args),
}))

jest.mock('firebase/app', () => {
    const chain: {
        collection: () => typeof chain
        doc: () => typeof chain
        update: (payload: unknown) => Promise<void>
    } = {
        collection: () => chain,
        doc: () => chain,
        update: (payload: unknown) => {
            mockUpdate(payload)
            return Promise.resolve()
        },
    }
    return {
        __esModule: true,
        default: {
            firestore: () => chain,
        },
    }
})

describe('CardCustomer durée du suivi', () => {
    beforeEach(() => {
        mockUpdate.mockClear()
        mockUseIcons.mockReturnValue({
            icons: [1, 2, 3, 4, 0, 0],
            positiveIcons: [0, 0, 0, 0, 0, 0],
            sessionFollow: '120',
            loading: false,
        })
    })

    it('propose les durées et enregistre le suivi choisi', () => {
        const setSaveConfirm = jest.fn()
        const { getByText, getByRole } = render(
            <CardCustomer userId="user" setSaveConfirm={setSaveConfirm} />
        )
        expect(getByText('Durée du suivi des croix')).toBeTruthy()
        expect(getByText('30 min')).toBeTruthy()
        expect(getByText('1 h')).toBeTruthy()
        expect(getByText('2 h')).toBeTruthy()
        expect(getByText('3 h')).toBeTruthy()
        expect(getByText('Journée')).toBeTruthy()
        expect(getByText('2 h').className).toMatch(/is-on/)

        fireEvent.click(getByText('30 min'))
        expect(getByText('30 min').className).toMatch(/is-on/)
        fireEvent.click(
            getByRole('button', { name: 'Enregistrer les modifications' })
        )
        expect(mockUpdate).toHaveBeenCalled()
        expect(mockUpdate.mock.calls[0][0].sessionFollow).toBe('30')
        expect(setSaveConfirm).toHaveBeenCalledWith(true)
    })
})
