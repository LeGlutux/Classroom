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

    const data = querySnapshot.data()!.periodes

    return data
}

export const fetchRunningPeriode = async (currentUserId: string) => {
    const db = Firebase.firestore()
    const querySnapshot = await db.collection('users').doc(currentUserId).get()

    const data = querySnapshot.data()!.runningPeriode

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

    const data = querySnapshot.data()

    return data
}
