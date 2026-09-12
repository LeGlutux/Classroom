import firebase from 'firebase/app'
import Firebase from './firebase'
import { wipeUserData } from './database'

export const deleteAccountErrorMessage = (error: {
    code?: string
    message?: string
    name?: string
}) => {
    const code = (error && (error.code || error.name)) || ''
    if (code === 'password-required') {
        return 'Entre ton mot de passe pour confirmer.'
    }
    if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        return 'Mot de passe incorrect.'
    }
    if (code === 'auth/too-many-requests') {
        return 'Trop d’essais. Réessaie dans un moment.'
    }
    if (code === 'auth/network-request-failed') {
        return 'Pas de réseau. Réessaie.'
    }
    if (code === 'not-signed-in' || code === 'auth/user-token-expired') {
        return 'Session expirée. Reconnecte-toi.'
    }
    return 'La suppression a échoué. Réessaie.'
}

export const deleteOwnAccount = async (password: string) => {
    const user = Firebase.auth().currentUser
    if (!user) {
        const error: { code: string } = { code: 'not-signed-in' }
        throw error
    }
    const email = user.email
    if (!email) {
        const error: { code: string } = { code: 'not-signed-in' }
        throw error
    }
    const trimmed = String(password || '')
    if (!trimmed) {
        const error: { code: string } = { code: 'password-required' }
        throw error
    }
    const cred = firebase.auth.EmailAuthProvider.credential(email, trimmed)
    await user.reauthenticateWithCredential(cred)
    const uid = user.uid
    await wipeUserData(uid)
    await Firebase.firestore().collection('users').doc(uid).delete()
    try {
        localStorage.removeItem('displayedGroup')
    } catch (error) {
        // Private mode.
    }
    await user.delete()
}
