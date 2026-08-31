import React, { useEffect, useState } from 'react'
import Firebase from './firebase'
import firebase from 'firebase/app'

interface AuthContextType {
    currentUser: null | firebase.User
    authReady: boolean
}

export const AuthContext = React.createContext<AuthContextType>({
    currentUser: null,
    authReady: false,
})

interface AuthProviderProps {
    children: React.ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [currentUser, setCurrentUser] = useState<firebase.User | null>(null)
    const [authReady, setAuthReady] = useState(false)

    useEffect(() => {
        const unsub = Firebase.auth().onAuthStateChanged((User) => {
            setCurrentUser(User)
            setAuthReady(true)
        })
        return () => unsub()
    }, [])
    return (
        <AuthContext.Provider value={{ currentUser, authReady }}>
            {children}
        </AuthContext.Provider>
    )
}
