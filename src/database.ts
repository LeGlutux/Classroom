import Firebase from './firebase'

export const fetchGroups = async (currentUserId: string) => {
    const db = Firebase.firestore()
    const querySnapshot = await db.collection('users').doc(currentUserId).get()

    return querySnapshot.data()!.classes
}


// import React, { useState, ChangeEvent, useContext, useEffect } from 'react'
// import Firebase from './firebase'

// export const fetchGroups = async (currentUserId: string) => {
//     const db = Firebase.firestore()
//     const querySnapshot = await (
//         await db
//             .collection('users')
//             .doc(currentUserId)
//             .get())
//         .data()



//     return querySnapshot as string[]
// }
