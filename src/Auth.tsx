import React, { useEffect, useState } from 'react'
import Firebase from 'firebase/app'

interface AuthContextType {
    currentUser: null | Firebase.User
}

export const AuthContext = React.createContext<AuthContextType>({
    currentUser: null,
})

interface AuthProviderProps {
    children: any
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [currentUser, setCurrentUser] = useState<Firebase.User | null>(null)

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
