import { useState, ChangeEvent, useContext, useEffect } from 'react'
import { fetchGroups, fetchCross, fetchStudents, fetchPeriodes, fetchRunningPeriode } from './database'

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
    }, [])

    // fetchStudents(currentUserId) in []

    const refreshCross = async () => {
        setCross(await fetchCross(currentUserId, currentStudentId))
    }

    return { cross, refreshCross }
}

export const useStudents = (currentUserId: string) => {
    const [students, setStudents] = useState<firebase.firestore.DocumentData[]>([])
    useEffect(() => {
        const fetch = async () => {
            setStudents((await fetchStudents(currentUserId)).students)
        }
        fetch()
    }, [])

    const filterStudents = async (group: string) => {
        const filteredStudents = (await fetchStudents(currentUserId)).students.filter((student) => student.classes.includes(group))
        setStudents(filteredStudents)
    }

    const allStudents = async () => {
        setStudents((await fetchStudents(currentUserId)).students)
    }

    return { students, filterStudents, allStudents }
}

export const usePeriodes = (currentUserId: string) => {
    const [periodes, setPeriodes] = useState<Date[]>([])

    useEffect(() => {
        const fetch = async () => {
            setPeriodes(await fetchPeriodes(currentUserId))
        }
        fetch()
    }, [])

    const refreshPeriodes = async () => {
        setPeriodes(await fetchPeriodes(currentUserId))
    }
    return { periodes, refreshPeriodes }
}

export const useRunningPeriode = (currentUserId: string) => {
    const [runningPeriode, setRunningPeriode] = useState<number>(1)

    useEffect(() => {
        const fetch = async () => {
            setRunningPeriode(await fetchRunningPeriode(currentUserId))
        }
        fetch()
    }, [])

    // [runningPeriode] dans le tableau vide ???

    const refreshRunningPeriode = async () => {
        setRunningPeriode(await fetchRunningPeriode(currentUserId))
    }

    return { runningPeriode, refreshRunningPeriode }
}
