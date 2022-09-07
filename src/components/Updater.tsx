import React, { useState } from 'react'
import firebase from 'firebase/app'
import { useVersion } from '../hooks'

interface UpdaterProps {
    userId: string
    userVersion: number
    refreshUser: () => Promise<void>
    students: firebase.firestore.DocumentData[]
    setUpdating: React.Dispatch<React.SetStateAction<boolean>>
}

export default (props: UpdaterProps) => {
    const { version, loading } = useVersion()

    const [checkUpdate, setCheckUpdate] = useState(true)
    const db = firebase.firestore()
    const updateRequired =
        checkUpdate && props.userVersion !== version && loading === false

    const onConfirmUpdate = () => {
        props.setUpdating(true)

        // props.students.forEach((s) => {
        //     db.collection('users')
        //         .doc(props.userId)
        //         .update({ icons: [1, 2, 3, 4, 0, 0] })
        // })

        db.collection('users').doc(props.userId).update({ version })
        props.refreshUser()
        setTimeout(() => {
            props.setUpdating(false)
        }, 4000)
    }

    return (
        <div
            className={`flex flex-col z-50 w-full h-full items-center justify-center self-center modal-positon ${
                updateRequired ? 'visible' : 'invisible'
            }`}
            style={{ backgroundColor: 'rgba(255,255,255,0.6)' }}
        >
            <div
                className={`flex flex-col border-black bg-white shadow-lg justify-center items-center w-3/4 h-100 relative ${
                    updateRequired ? 'entering-t' : 'invisible'
                }`}
            >
                {/* <span className="absolute top-0 right-0 p-4">
                    <svg
                        className="h-4 w-4 fill-current text-grey hover:text-grey-darkest"
                        role="button"
                        onClick={() => setCheckUpdate(false)}
                    >
                        <title>Close</title>
                        <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                    </svg>
                </span> */}
                <div className="text-xl text-center font-bold mx-2 xl:text-3xl">
                    Votre version de Thòt Note n'est pas à jour{' '}
                </div>

                <div className="text-sm text-center mx-2 mt-4 xl:text-xl">
                    Nouveautés : les listes sont maintenant rangées dans l'ordre NOM Prénom +
                    Quelques ajustements esthétiques
                </div>

                <div className="flex flex-col h-40 justify-around mt-12 items-center">
                    <button
                        className="bg-green-700 rounded-lg font-bold w-32 h-12 lg:w-32 lg:h-12 xl:w-48 xl:h-24 shadow-xl font-studentName sm:text-lg md:text-xl lg:text-2xl xl:text-2xl"
                        onClick={() => {
                            onConfirmUpdate()
                            setCheckUpdate(false)
                        }}
                    >
                        Mettre à jour
                    </button>
                    <button
                        className="text-blue-500 mt-8 w-40 h-12 lg:w-32 lg:h-12 xl:w-40 xl:h-16 font-studentName text-sm"
                        onClick={() => {
                            setCheckUpdate(false)
                        }}
                    >
                        Continuer avec la version actuelle
                    </button>
                </div>
            </div>
        </div>
    )
}
