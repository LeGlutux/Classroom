import { deleteAccountErrorMessage } from './deleteAccount'

describe('deleteAccountErrorMessage', () => {
    it('demande le mot de passe s’il manque', () => {
        expect(deleteAccountErrorMessage({ code: 'password-required' })).toBe(
            'Entre ton mot de passe pour confirmer.'
        )
    })

    it('signale un mot de passe faux', () => {
        expect(deleteAccountErrorMessage({ code: 'auth/wrong-password' })).toBe(
            'Mot de passe incorrect.'
        )
        expect(
            deleteAccountErrorMessage({ code: 'auth/invalid-credential' })
        ).toBe('Mot de passe incorrect.')
    })

    it('a un message générique sinon', () => {
        expect(deleteAccountErrorMessage({ code: 'auth/internal-error' })).toBe(
            'La suppression a échoué. Réessaie.'
        )
    })
})
