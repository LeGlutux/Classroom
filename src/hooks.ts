import { useState, ChangeEvent, useContext, useEffect } from 'react'
import { fetchGroups, fetchCross, fetchStudents } from './database'

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
export const useCross = (currentUserId: string, currentStudentId: string) => {
    const [cross, setCross] = useState<firebase.firestore.DocumentData[]>([])

    useEffect(() => {
        const fetch = async () => {
            setCross(await fetchCross(currentUserId, currentStudentId))
        }
        fetch()
    }, [fetchStudents(currentUserId)])

    const refreshCross = async () => {
        setCross(await fetchCross(currentUserId, currentStudentId))
    }

    return { cross, refreshCross }
}

export const useStudents = (currentUserId: string) => {
    const [students, setStudents] = useState<firebase.firestore.DocumentData[]>([])
    useEffect(() => {
        const fetch = async () => {
            setStudents(await fetchStudents(currentUserId))
        }
        fetch()
    }, [])

    const filterStudents = async (group: string) => {
        const filteredStudents = (await fetchStudents(currentUserId)).filter((student) => student.classes.includes(group))
        setStudents(filteredStudents)
    }

    const allStudents = async () => {
        setStudents(await fetchStudents(currentUserId))
    }

    return { students, filterStudents, allStudents }
}
