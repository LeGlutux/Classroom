import firebase from 'firebase/app'
import Firebase from './firebase'
import { StudentInterface } from './interfaces/Student'; // Assurez-vous que le chemin est correct
import {
    DEFAULT_NEGATIVE_ICONS,
    DEFAULT_POSITIVE_ICONS,
    padIconList,
} from './functions'
import { parseSmsConfig, SmsTemplate } from './sms'


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
    // Hard fetch - toujours récupérer depuis Firebase
    const querySnapshot = await db
        .collection('users')
        .doc(currentUserId)
        .collection('eleves')
        .doc(currentStudentId)
        .collection('crosses')
        .get()

    const data = [] as firebase.firestore.DocumentData[]

    querySnapshot.docs.forEach((doc) => {
        const docData = doc.data()
        if (docData) {
            data.push(docData)
        }
    })

    return data
}

export const fetchCrosses = async (
    currentUserId: string,
    allStudentIds: string[]
) => {
    const db = Firebase.firestore()
    const promises = allStudentIds.map(async (id) => {
        const querySnapshot = await db
            .collection('users')
            .doc(currentUserId)
            .collection('eleves')
            .doc(id)
            .collection('crosses')
            .get()

        const docs = [] as firebase.firestore.DocumentData[]
        querySnapshot.docs.forEach((doc) => docs.push(doc.data()))
        return { id, docs }
    })

    const data = await Promise.all(promises)
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

export const fetchSmsConfig = async () => {
    const db = Firebase.firestore()
    const snap = await db.collection('props').doc('sms-config').get()
    return parseSmsConfig(snap.data())
}

export const markTutorialCompleted = async (currentUserId: string) => {
    const db = Firebase.firestore()
    await db
        .collection('users')
        .doc(currentUserId)
        .set({ tutorialCompleted: true }, { merge: true })
}

export const saveSmsConfig = async (patch: {
    smsEnabled?: boolean
    defaultTemplates?: SmsTemplate[]
}) => {
    const db = Firebase.firestore()
    const payload: { [key: string]: unknown } = { kind: 'sms-config' }
    if (patch.smsEnabled !== undefined) payload.smsEnabled = patch.smsEnabled
    if (patch.defaultTemplates !== undefined) {
        payload.defaultTemplates = patch.defaultTemplates
    }
    await db
        .collection('props')
        .doc('sms-config')
        .set(payload, { merge: true })
}

export const fetchIcons = async (currentUserId: string) => {
    const db = Firebase.firestore()
    const querySnapshot = await db.collection('users').doc(currentUserId).get()
    const data = querySnapshot.data()

    return {
        icons: padIconList(data?.icons, DEFAULT_NEGATIVE_ICONS),
        positiveIcons: padIconList(data?.positiveIcons, DEFAULT_POSITIVE_ICONS),
    }
}

export const saveNameColorRules = async (
    currentUserId: string,
    rules: unknown
) => {
    const db = Firebase.firestore()
    await db
        .collection('users')
        .doc(currentUserId)
        .set({ nameColorRules: rules }, { merge: true })
}

const BATCH_LIMIT = 400

const deleteRefs = async (refs: firebase.firestore.DocumentReference[]) => {
    const db = Firebase.firestore()
    for (let index = 0; index < refs.length; index += BATCH_LIMIT) {
        const batch = db.batch()
        refs.slice(index, index + BATCH_LIMIT).forEach((ref) =>
            batch.delete(ref)
        )
        await batch.commit()
    }
}

export const wipeUserData = async (uid: string) => {
    const db = Firebase.firestore()
    const userRef = db.collection('users').doc(uid)
    const userSnap = await userRef.get()
    const previous = userSnap.data() || {}
    const toDelete: firebase.firestore.DocumentReference[] = []

    const elevesSnap = await userRef.collection('eleves').get()
    for (let i = 0; i < elevesSnap.docs.length; i++) {
        const eleveRef = elevesSnap.docs[i].ref
        const [crossesSnap, listesSnap] = await Promise.all([
            eleveRef.collection('crosses').get(),
            eleveRef.collection('listes').get(),
        ])
        crossesSnap.forEach((doc) => toDelete.push(doc.ref))
        listesSnap.forEach((doc) => toDelete.push(doc.ref))
        toDelete.push(eleveRef)
    }

    const listsSnap = await userRef.collection('lists').get()
    listsSnap.forEach((doc) => toDelete.push(doc.ref))
    await deleteRefs(toDelete)

    await userRef.set({
        id: uid,
        email: previous.email || '',
        userName: previous.userName || '',
        classes: [],
        periodes: [],
        postIt: [],
        ...(Array.isArray(previous.nameColorRules)
            ? { nameColorRules: previous.nameColorRules }
            : {}),
        wiped: true,
        wipedAt: firebase.firestore.FieldValue.serverTimestamp(),
    })

    const propsSnap = await db.collection('props').get()
    const reportRefs: firebase.firestore.DocumentReference[] = []
    propsSnap.docs.forEach((doc) => {
        const data = doc.data()
        if (data.kind === 'report' && data.uid === uid) {
            reportRefs.push(doc.ref)
        }
    })
    if (reportRefs.length) await deleteRefs(reportRefs)
}
