import firebase from 'firebase'
import Firebase from './firebase'
import { StudentInterface } from './interfaces/Student'; // Assurez-vous que le chemin est correct


export const fetchPostIts = async (currentUserId: string) => {
    const db = Firebase.firestore()
    const querySnapshot = await db.collection('users').doc(currentUserId).get()

    const data = querySnapshot.data()?.postIt

    return data
}

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

export const fetchCrosses = (
    currentUserId: string,
    allStudentIds: string[]
) => {
    const db = Firebase.firestore()
    const data: { id: string; docs: firebase.firestore.DocumentData[] }[] = []
    allStudentIds.forEach(async (id) => {
        const querySnapshot = await db
            .collection('users')
            .doc(currentUserId)
            .collection('eleves')
            .doc(id)
            .collection('crosses')
            .get()

        const docs = [] as firebase.firestore.DocumentData[]
        querySnapshot.docs.forEach((doc) => docs.push(doc.data()))
        data.push({ id, docs })
    })

    return data
}

export const fetchListState = async (
    currentUserId: string,
    currentStudentId: string,
    currentListId: string
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

export const fetchStudentsIds = async (currentUserId: string) => {
    const db = Firebase.firestore()
    const querySnapshot = await db
        .collection('users')
        .doc(currentUserId)
        .collection('eleves')
        .orderBy('name')
        .get()

    const data = [] as string[]
    querySnapshot.docs.forEach((doc) => data.push(doc.data().id))

    return data
}

export const fetchStudents = async (currentUserId: string): Promise<StudentInterface[]> => {
    const db = Firebase.firestore();
    const querySnapshot = await db.collection('users').doc(currentUserId).collection('eleves').orderBy('name').get();

    // Transformation des documents Firestore en objets Student :
    return querySnapshot.docs.map(doc => {
        const data = doc.data(); // Récupère les données brutes du document

        return {
            id: doc.id, // Ajoute l'id du document
            name: data.name, // Typage manuel pour correspondre à l'interface Student
            surname: data.surname,
            classes: data.classes,
            highlight: data.highlight,
            selected: data.selected,
            comment: data.comment,
            crosses: data.crosses || [],
        } as StudentInterface;
    });
};

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
    const notes = querySnapshot.data()!.notes
    const data = { classes, highlight, name, surname, id, notes }
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

export const fetchAllUsersIds = async (currentUserId: string) => {
    const db = Firebase.firestore()
    const querySnapshot = await db.collection('users').orderBy('email').get()

    const data = [] as firebase.firestore.DocumentData[]
    querySnapshot.docs.forEach((doc) => data.push(doc.data()))

    const Ids = data.map((doc) => doc.id)

    return Ids
}

export const fetchComment = async (
    currentUserId: string,
    currentStudentId: string
) => {
    const db = Firebase.firestore()
    const querySnapshot = await db
        .collection('users')
        .doc(currentUserId)
        .collection('eleves')
        .doc(currentStudentId)
        .get()

    const data = querySnapshot.data()?.comment

    return data
}
export const fetchVersion = async () => {
    const db = Firebase.firestore()
    const querySnapshot = await db.collection('props').doc('app-data').get()

    const version = querySnapshot.data()?.version

    return version
}

export const fetchIcons = async (currentUserId: string) => {
    const db = Firebase.firestore()
    const querySnapshot = await db.collection('users').doc(currentUserId).get()

    const data = querySnapshot.data()?.icons

    return data
}
