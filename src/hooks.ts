import { useState, ChangeEvent, useContext, useEffect } from 'react'
import { fetchGroups, fetchCross } from './database'

export const useGroups = (currentUserId: string) => {
    const [groups, setGroups] = useState<string[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetch = async () => {
            setLoading(true)
            setGroups(await fetchGroups(currentUserId))
            setLoading(false)
        }
        fetch()
    }, [])

    const refreshGroups = async () => {
        setLoading(true)
        setGroups(await fetchGroups(currentUserId))
        setLoading(false)
    }

    return { groups, loading, refreshGroups }
}
export const useCross = (currentUserId: string, currentStudentId: string, type: string) => {
    const [cross, setCross] = useState<firebase.firestore.DocumentData>([])

    useEffect(() => {
        const fetch = async () => {
            setCross(await fetchCross(currentUserId, currentStudentId, type))
        }
        fetch()
    }, [])

    const refreshCross = async () => {
        setCross(await fetchCross(currentUserId, currentStudentId, type))
    }

    return { cross, refreshCross }
}
