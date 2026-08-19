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

    if (!updateRequired) return null

    return (
        <div className="modal-overlay">
            <div className="modal-card entering-t">
                <div className="empty-state-title" style={{ fontSize: '1.35rem' }}>
                    Votre version de Thòt Note n'est pas à jour
                </div>
                <div className="empty-state-text" style={{ marginTop: '0.85rem' }}>
                    Des post-it sont maintenant disponibles pour chaque classe.
                    Un badge de notification apparaîtra lorsqu'un post-it non
                    vide aura été écrit pour une classe. Pour en créer un, il
                    suffit d'appuyer sur le bouton menu depuis une classe.
                </div>
                <div className="modal-actions">
                    <button
                        className="btn-secondary"
                        type="button"
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
