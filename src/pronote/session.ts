import Firebase from '../firebase'
import { parsePronoteLink, PronoteLink } from './link'

const passwordStorageKey = (uid: string) => 'thot.pronote.password.' + uid

export const readPronotePassword = (uid: string) => {
    try {
        return sessionStorage.getItem(passwordStorageKey(uid)) || ''
    } catch (err) {
        return ''
    }
}

export const writePronotePassword = (uid: string, password: string) => {
    try {
        if (password) sessionStorage.setItem(passwordStorageKey(uid), password)
        else sessionStorage.removeItem(passwordStorageKey(uid))
    } catch (err) {
        // ignore
    }
}

export const loadPronoteLinkForUser = async (
    uid: string
): Promise<PronoteLink | null> => {
    const doc = await Firebase.firestore()
        .collection('users')
        .doc(uid)
        .get()
    const data = doc.data()
    const base = parsePronoteLink(data ? data.pronoteLink : null)
    if (!base) return null
    const password = readPronotePassword(uid) || base.password
    if (!password) return { ...base, password: '' }
    return { ...base, password }
}
