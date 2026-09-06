import React from 'react'
import { act, fireEvent, render } from '@testing-library/react'
import ListStatusButton from './ListStatusButton'

const mockUpdate = jest.fn(() => Promise.resolve())

jest.mock('firebase/app', () => {
    const chain: {
        collection: () => typeof chain
        doc: () => typeof chain
        update: (...args: unknown[]) => Promise<void>
    } = {
        collection: () => chain,
        doc: () => chain,
        update: (...args: unknown[]) => mockUpdate(...args),
    }
    return {
        __esModule: true,
        default: {
            firestore: () => chain,
        },
    }
})

const renderButton = (listState: number[]) =>
    render(
        <div style={{ width: 54, height: 48 }}>
            <ListStatusButton
                studentId="stu"
                userId="user"
                listId="list"
                indexOfItem={0}
                listState={listState}
            />
        </div>
    )

describe('ListStatusButton', () => {
    beforeEach(() => {
        mockUpdate.mockClear()
        jest.useFakeTimers()
    })

    afterEach(() => {
        jest.useRealTimers()
    })

    it('fait tourner la case à chaque appui', () => {
        const { container } = renderButton([2, 0, 0, 0, 0])
        const button = container.querySelector('.list-status') as HTMLButtonElement
        expect(button.className).toMatch(/is-no/)
        fireEvent.click(button)
        expect(button.className).toMatch(/is-maybe/)
        expect(mockUpdate).toHaveBeenCalledWith({ state: [3, 0, 0, 0, 0] })
    })

    it('remet la case à vide après un appui long, sans tourner', () => {
        const { container } = renderButton([2, 0, 0, 0, 0])
        const button = container.querySelector('.list-status') as HTMLButtonElement
        fireEvent.pointerDown(button)
        act(() => {
            jest.advanceTimersByTime(500)
        })
        fireEvent.pointerUp(button)
        fireEvent.click(button)
        expect(button.className).toMatch(/is-empty/)
        expect(mockUpdate).toHaveBeenCalledTimes(1)
        expect(mockUpdate).toHaveBeenCalledWith({ state: [0, 0, 0, 0, 0] })
    })
})
