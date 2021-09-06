import firebase from 'firebase'
import Firebase from './firebase'

export const fetchGroups = async (currentUserId: string) => {
    const db = Firebase.firestore()
    const querySnapshot = await db.collection('users').doc(currentUserId).get()

    const data = querySnapshot.data()?.classes

    return data
}

export const fetchCross = async (
    currentUserId: string,
    currentStudentId: string
) => {
    const db = Firebase.firestore()
    const querySnapshot = await db
        .collection('users')
        .doc(currentUserId)
        .collection('eleves')
        .doc(currentStudentId)
        .collection('crosses')
        .get()

    const data = [] as firebase.firestore.DocumentData[]

    querySnapshot.docs.forEach((doc) => data.push(doc.data()))

    return data
}   

export const fetchCrosses = async (
    currentUserId: string,
    currentStudentId: string
) => {
    const db = Firebase.firestore()
    const data = await db
        .collection('users')
        .doc(currentUserId)
        .collection('eleves')
        .doc(currentStudentId)
        .collection('crosses')
        .get()

    return data
}

export const fetchListState = async (
    currentUserId: string,
    currentStudentId: string,
    currentListId: string,
) => {
    const db = Firebase.firestore()
    const querySnapshot = await db
        .collection('users')
        .doc(currentUserId)
        .collection('eleves')
        .doc(currentStudentId)
        .collection('listes')
        .doc(currentListId.concat('s'))
        .get()
    const data = querySnapshot.data()?.state
    return data
}

export const fetchStudents = async (currentUserId: string) => {
    const db = Firebase.firestore()
    const querySnapshot = await db
        .collection('users')
        .doc(currentUserId)
        .collection('eleves')
        .orderBy('name')
        .get()

    const data = [] as firebase.firestore.DocumentData[]
    querySnapshot.docs.forEach((doc) => data.push(doc.data()))

    return data
}

export const fetchPeriodes = async (currentUserId: string) => {
    const db = Firebase.firestore()
    const querySnapshot = await db.collection('users').doc(currentUserId).get()

    const data = querySnapshot.data()?.periodes

    return data
}

export const fetchRunningPeriode = async (currentUserId: string) => {
    const db = Firebase.firestore()
    const querySnapshot = await db.collection('users').doc(currentUserId).get()

    const data = querySnapshot.data()?.runningPeriode

    return data
}

export const fetchPaths = async () => {
    const db = Firebase.firestore()
    const querySnapshot = await db.collection('paths').get()

    const data = [] as string[]

    querySnapshot.docs.forEach((doc) => data.push(doc.id))

    return data
}

export const fetchStudentWithId = async (
    currentUserId: string,
    studentId: string
) => {
    const db = Firebase.firestore()
    const querySnapshot = await db
        .collection('users')
        .doc(currentUserId)
        .collection('eleves')
        .doc(studentId)
        .get()

    const classes = querySnapshot.data()!.classes
    const highlight = querySnapshot.data()!.highlight
    const name = querySnapshot.data()!.name
    const surname = querySnapshot.data()!.surname
    const id = querySnapshot.data()!.id
    const data = { classes, highlight, name, surname, id }
    return data
}

export const fetchLists = async (currentUserId: string) => {
    const db = Firebase.firestore()
    const querySnapshot = await db
        .collection('users')
        .doc(currentUserId)
        .collection('lists')
        .get()

    const data = [] as firebase.firestore.DocumentData[]
    querySnapshot.docs.forEach((doc) => data.push(doc.data()))

    return data
}

export const fetchUser = async (currentUserId: string) => {
    const db = Firebase.firestore()
    const querySnapshot = await db.collection('users').doc(currentUserId).get()

    const data = querySnapshot.data()

    return data
}

export const fetchComment = async (currentUserId: string, currentStudentId: string) => {
    const db = Firebase.firestore()
    const querySnapshot = await db.collection('users').doc(currentUserId).collection('eleves').doc(currentStudentId).get()

    const data = querySnapshot.data()?.comment

    return data
}
