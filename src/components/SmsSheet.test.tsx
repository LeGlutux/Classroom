import React from 'react'
import { fireEvent, render, wait } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { MemoryRouter } from 'react-router-dom'
import { AuthContext } from '../Auth'
import SmsSheet, { openStudentSms } from './SmsSheet'

const mockSend = jest.fn()

jest.mock('../firebase', () => ({
    __esModule: true,
    default: {
        analytics: () => undefined,
        auth: () => ({ onAuthStateChanged: () => () => undefined }),
        firestore: () => ({}),
    },
}))

jest.mock('../sms', () => {
    const actual = jest.requireActual('../sms')
    return {
        ...actual,
        sendParentSms: (...args: unknown[]) => mockSend(...args),
        canPickContacts: () => false,
    }
})

jest.mock('firebase/app', () => {
    const chain: {
        collection: () => typeof chain
        doc: () => typeof chain
        get: () => Promise<{ data: () => { smsTemplates: unknown[] } }>
    } = {
        collection: () => chain,
        doc: () => chain,
        get: () =>
            Promise.resolve({
                data: () => ({
                    smsTemplates: [
                        {
                            id: 'travail',
                            title: 'Travail non rendu',
                            body: 'Bonjour, #prénom n’a pas rendu le travail.',
                        },
                    ],
                }),
            }),
    }
    return {
        __esModule: true,
        default: {
            initializeApp: () => ({
                analytics: () => undefined,
            }),
            firestore: () => chain,
        },
    }
})

const wrap = (ui: React.ReactElement) =>
    render(
        <MemoryRouter>
            <AuthContext.Provider
                value={{
                    currentUser: { uid: 'u1' } as any,
                    authReady: true,
                }}
            >
                {ui}
            </AuthContext.Provider>
        </MemoryRouter>
    )

describe('SmsSheet', () => {
    beforeEach(() => {
        mockSend.mockClear()
    })

    it('ouvre une modale de confirmation au clic sur un modèle', async () => {
        const { getByText, queryByText, container } = wrap(<SmsSheet />)
        act(() => {
            openStudentSms({
                prenom: 'Lila',
                nom: 'Amraoui',
                classe: 'Hima',
            })
        })

        await wait(() => getByText('Travail non rendu'))
        expect(queryByText('Ouvrir Messages')).toBeNull()

        fireEvent.click(getByText('Travail non rendu'))
        expect(getByText('Ouvrir Messages')).toBeTruthy()
        expect(container.querySelector('.sms-confirm-body')!.textContent).toBe(
            'Bonjour, Lila n’a pas rendu le travail.'
        )
        expect(mockSend).not.toHaveBeenCalled()

        fireEvent.click(getByText('Ouvrir Messages'))
        expect(mockSend).toHaveBeenCalled()
    })
})
