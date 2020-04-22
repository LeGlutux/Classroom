import React, { useState, ChangeEvent, useContext, useEffect } from 'react'
import Firebase from './firebase'

export const fetchGroups = async (currentUserId: string) => {
    const db = Firebase.firestore()
    const querySnapshot = await db
        .collection('users')
        .doc(currentUserId)
        .collection('classes')
        .get()

    return querySnapshot.docs.map((doc) => doc.data().classe as string)
}