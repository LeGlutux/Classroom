import Firebase from './firebase'

export const fetchGroups = async (currentUserId: string) => {
    const db = Firebase.firestore()
    const querySnapshot = await db.collection('users').doc(currentUserId).get()

    return querySnapshot.data()!.classes
}

export const fetchCross = async (currentUserId: string, currentStudentId: string) => {
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
