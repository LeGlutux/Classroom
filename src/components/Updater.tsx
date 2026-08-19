import React, { useState } from 'react'
import firebase from 'firebase/app'
import { useVersion } from '../hooks'

interface UpdaterProps {
    userId: string
    userVersion: number
    refreshUser: () => Promise<void>
    students: firebase.firestore.DocumentData[]
    setUpdating: React.Dispatch<React.SetStateAction<boolean>>
    classes: string[]
}

export default (props: UpdaterProps) => {
    const { version, loading } = useVersion()

    const [checkUpdate, setCheckUpdate] = useState(true)
    const db = firebase.firestore()
    const updateRequired =
        checkUpdate && props.userVersion !== version && loading === false

    const onConfirmUpdate = () => {
        props.setUpdating(true)

        const postIt = [] as { classe: string; content: string }[]
        props.classes.forEach((classe) => {
            postIt.push({ classe, content: '' })
        })
        db.collection('users').doc(props.userId).update({ postIt })

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
                <div className="empty-title mx-2">
                    Votre version de Thòt Note n'est pas à jour
                </div>

                <div className="empty-text mx-2 mt-2">
                    Des post-it sont maintenant disponibles pour chaque classe.
                    Un badge de notification apparaîtra lorsque un post-it non
                    vide aura été écrit pour une classe. Pour en créer un, il
                    suffit d'appuyer sur le bouton menu depuis une classe.
                </div>

                <div className="flex flex-col h-40 justify-around mt-12 items-center">
                    <button
                        className="bg-green-700 rounded-lg font-bold px-4 h-10 text-sm shadow-xl font-studentName flex items-center justify-center"
                        onClick={() => {
                            onConfirmUpdate()
                            setCheckUpdate(false)
                        }}
                    >
                        Mettre à jour
                    </button>
                </div>
            </div>
        </div>
    )
}
