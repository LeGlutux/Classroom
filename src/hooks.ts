import { useState, ChangeEvent, useContext, useEffect } from 'react'
import { fetchGroups } from './database'

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
