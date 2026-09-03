import React from 'react'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthContext } from '../Auth'
import NavBar from './NavBar'

jest.mock('../firebase', () => ({
    __esModule: true,
    default: {
        firestore: () => ({
            collection: () => ({
                onSnapshot: (success: (snap: any) => void) => {
                    success({
                        docs: [
                            { data: () => ({ kind: 'report', status: 'pending' }) },
                            { data: () => ({ kind: 'report' }) },
                            { data: () => ({ kind: 'report', status: 'seen' }) },
                            { data: () => ({ kind: 'app-data' }) },
                        ],
                    })
                    return () => undefined
                },
            }),
        }),
    },
}))

const renderNav = (email: string) =>
    render(
        <AuthContext.Provider
            value={{
                currentUser: { email, uid: 'test-uid' } as any,
                authReady: true,
            }}
        >
            <MemoryRouter>
                <NavBar activeMenu="home" onHomeClick={() => undefined} />
            </MemoryRouter>
        </AuthContext.Provider>
    )

describe('NavBar pastille admin', () => {
    it('affiche la pastille pour l’admin s’il y a des signalements en attente', () => {
        const { getByLabelText } = renderNav('lp.bendeks@gmail.com')
        expect(
            getByLabelText('Paramètres, 2 nouveaux signalements')
        ).toBeTruthy()
    })

    it('n’affiche pas la pastille pour un compte non admin', () => {
        const { getByLabelText, queryByLabelText } = renderNav('prof@ecole.fr')
        expect(getByLabelText('Paramètres')).toBeTruthy()
        expect(queryByLabelText(/nouveau/)).toBeNull()
    })
})
