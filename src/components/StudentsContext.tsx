import React, { createContext, useContext, useEffect, useState } from 'react';
import Firebase from 'firebase/app';
import 'firebase/firestore';
import { AuthContext } from '../Auth';
import { StudentInterface } from '../interfaces/Student'; // Importer l'interface

const StudentsContext = createContext<StudentInterface[]>([]);

export const StudentsProvider = ({ children }: { children: React.ReactNode }) => {
    const { currentUser } = useContext(AuthContext);
    const [students, setStudents] = useState<StudentInterface[]>([]);

    useEffect(() => {
        if (!currentUser) return;

        const unsubscribe = Firebase.firestore()
            .collection('users')
            .doc(currentUser.uid)
            .collection('eleves')
            .onSnapshot(snapshot => {
                const studentData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                } as StudentInterface));
                setStudents(studentData);
            });

        return () => unsubscribe();
    }, [currentUser]);

    return (
        <StudentsContext.Provider value={students}>
            {children}
        </StudentsContext.Provider>
    );
};

export const useStudentsContext = () => useContext(StudentsContext);