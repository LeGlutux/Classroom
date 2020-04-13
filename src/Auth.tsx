import React, { useEffect, useState } from 'react'
import Firebase, { app } from 'firebase'

export const AuthContext = React.createContext()

interface AuthProviderProps {
    children: any
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [currentUser, setCurrentUser] = useState(null)

    useEffect(() => {
        app.auth().onAuthStateChanged(setCurrentUser)
    }, [])
    return (
        <AuthContext.Provider value={{ currentUser }}>
            {children}
        </AuthContext.Provider>
    )
}
