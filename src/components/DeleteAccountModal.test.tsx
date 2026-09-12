import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import DeleteAccountModal from './DeleteAccountModal'

jest.mock('../deleteAccount', () => ({
    deleteOwnAccount: jest.fn(() => Promise.resolve()),
    deleteAccountErrorMessage: () => 'Erreur',
}))

describe('DeleteAccountModal', () => {
    it('ne s’affiche pas fermée', () => {
        const { container } = render(
            <DeleteAccountModal open={false} onClose={() => undefined} />
        )
        expect(container.querySelector('.modal-card')).toBeNull()
    })

    it('demande le mot de passe', () => {
        const { getByText, getByPlaceholderText } = render(
            <DeleteAccountModal open={true} onClose={() => undefined} />
        )
        expect(getByText('Supprimer le compte ?')).toBeTruthy()
        expect(getByPlaceholderText('Mot de passe')).toBeTruthy()
        expect(getByText('Supprimer définitivement')).toBeTruthy()
    })

    it('annule sans supprimer', () => {
        const onClose = jest.fn()
        const { getByText } = render(
            <DeleteAccountModal open={true} onClose={onClose} />
        )
        fireEvent.click(getByText('Annuler'))
        expect(onClose).toHaveBeenCalled()
    })
})
