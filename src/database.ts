import Firebase from './firebase'

export const fetchGroups = async (currentUserId: string) => {
    const db = Firebase.firestore()
    const querySnapshot = await db.collection('users').doc(currentUserId).get()

    return querySnapshot.data()!.classes
}

export const fetchCross = async (currentUserId: string, currentStudentId: string, type: string) => {
    const db = Firebase.firestore()
    const querySnapshot = await db
        .collection('users')
        .doc(currentUserId)
        .collection('eleves')
        .doc(currentStudentId)
        .collection('crosses')
        .where('type', '==', type)
        .get()

    return querySnapshot.docs
}