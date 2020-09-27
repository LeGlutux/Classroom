import { useState, useEffect } from 'react'
import {
    fetchGroups,
    fetchCross,
    fetchStudents,
    fetchPeriodes,
    fetchRunningPeriode,
    fetchPaths,
    fetchStudentWithId,
    fetchCrosses,
    fetchNewbie,
    fetchUpdated,
    fetchNotYetSelectedStudents,
    fetchSelectedStudents,
} from './database'

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
    }, [currentUserId])

    const refreshGroups = async () => {
        setLoading(true)
        setGroups(await fetchGroups(currentUserId))
        setLoading(false)
    }

    return { groups, loading, refreshGroups }
}

export const useCrosses = (currentUserId: string, currentStudentId: string) => {
    const [crosses, setCrosses] = useState<
        firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>
    >()

    useEffect(() => {
        const fetch = async () => {
            setCrosses(await fetchCrosses(currentUserId, currentStudentId))
        }
        fetch()
    }, [currentUserId, currentStudentId])

    const refreshCrosses = async () => {
        setCrosses(await fetchCrosses(currentUserId, currentStudentId))
    }

    return { crosses, refreshCrosses }
}

export const useCross = (currentUserId: string, currentStudentId: string) => {
    const [cross, setCross] = useState<firebase.firestore.DocumentData[]>([])

    useEffect(() => {
        const fetch = async () => {
            setCross(await fetchCross(currentUserId, currentStudentId))
        }
        fetch()
    }, [currentUserId, currentStudentId])

    const refreshCross = async () => {
        setCross(await fetchCross(currentUserId, currentStudentId))
    }

    return { cross, refreshCross }
}

export const useStudents = (currentUserId: string) => {
    const [students, setStudents] = useState<firebase.firestore.DocumentData[]>(
        []
    )
    useEffect(() => {
        const fetch = async () => {
            setStudents(await fetchStudents(currentUserId))
        }
        fetch()
    }, [currentUserId])

    const filterStudents = async (group: string) => {
        const filteredStudents = (
            await fetchStudents(currentUserId)
        ).filter((student) => student.classes.includes(group))
        setStudents(filteredStudents)
    }

    const allStudents = async () => {
        setStudents(await fetchStudents(currentUserId))
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
    }, [currentUserId])

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
    }, [currentUserId])

    // [runningPeriode] dans le tableau vide ???

    const refreshRunningPeriode = async () => {
        setRunningPeriode(await fetchRunningPeriode(currentUserId))
    }

    return { runningPeriode, refreshRunningPeriode }
}

export const usePaths = () => {
    const [paths, setPaths] = useState<string[]>([])

    useEffect(() => {
        const fetch = async () => {
            setPaths(await fetchPaths())
        }
        fetch()
    }, [])

    // [Paths] dans le tableau vide ???

    const refreshPaths = async () => {
        setPaths(await fetchPaths())
    }

    return { paths, refreshPaths }
}

export const useStudent = (currentUserId: string, studentId: string) => {
    const [student, setStudent] = useState<firebase.firestore.DocumentData>()

    useEffect(() => {
        const fetch = async () => {
            setStudent(await fetchStudentWithId(currentUserId, studentId))
        }
        fetch()
    }, [currentUserId, studentId])

    return student
}

export const useNewbie = (currentUserId: string) => {
    const [newbie, setNewbie] = useState<number>(0)

    useEffect(() => {
        const fetch = async () => {
            setNewbie(await fetchNewbie(currentUserId))
        }
        fetch()
    }, [currentUserId])

    return newbie
}

export const useUpdated = (currentUserId: string) => {
    const [updated, setUpdated] = useState<boolean>(false)

    useEffect(() => {
        const fetch = async () => {
            setUpdated(await fetchUpdated(currentUserId))
        }
        fetch()
    }, [currentUserId])

    return updated
}

export const useMemoryStudents = (currentUserId: string, classe: string) => {
    const [selectedStudents, setSelectedStudents] = useState<firebase.firestore.DocumentData[]>([])
    const [notYetSelectedStudents, setNotYetSelectedStudents] = useState<firebase.firestore.DocumentData[]>([])

    useEffect(() => {
        const fetch = async () => {
            setSelectedStudents(await fetchSelectedStudents(currentUserId, classe))
            setNotYetSelectedStudents(await fetchNotYetSelectedStudents(currentUserId, classe))
        }
        fetch()
    }, [currentUserId])

    return { selectedStudents, notYetSelectedStudents }
}
