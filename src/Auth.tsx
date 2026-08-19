import React, { useEffect, useState } from 'react'
import Firebase from './firebase'
import firebase from 'firebase/app'

interface AuthContextType {
    currentUser: null | firebase.User
}

export const AuthContext = React.createContext<AuthContextType>({
    currentUser: null,
})

interface AuthProviderProps {
    children: React.ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [currentUser, setCurrentUser] = useState<firebase.User | null>(null)

    useEffect(() => {
        Firebase.auth().onAuthStateChanged((User) => {
            setCurrentUser(User)
        })
    }, [])
    return (
        <AuthContext.Provider value={{ currentUser }}>
            {children}
        </AuthContext.Provider>
    )
}
