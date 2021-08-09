import firebase from 'firebase'
import { useState, useEffect, RefObject } from 'react'
import {
    fetchGroups,
    fetchUser,
    fetchCross,
    fetchStudents,
    fetchPeriodes,
    fetchRunningPeriode,
    fetchPaths,
    fetchStudentWithId,
    fetchCrosses,
    fetchLists,
    fetchListState,
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

export const useCross = (currentUserId: string, currentStudentId: string, refresher?: number) => {
    const [cross, setCross] = useState<firebase.firestore.DocumentData[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetch = async () => {
            setLoading(true)
            setCross(await fetchCross(currentUserId, currentStudentId))
            setLoading(false)
        }
        fetch()
    },
        [currentUserId, currentStudentId, refresher]

    )

    useEffect(() => {
        const fetch = async () => {
            setCross(await fetchCross(currentUserId, currentStudentId))
        }
        fetch()
    }, [currentUserId, currentStudentId])

    const refreshCross = async () => {
        setCross(await fetchCross(currentUserId, currentStudentId))
    }

    return { loading, cross, refreshCross }
}

export const useListState = (currentUserId: string, currentStudentId: string, currentListId: string) => {
    const [listState, setListState] = useState<number[]>([0, 0, 0, 0])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetch = async () => {
            setLoading(true)
            setListState(await fetchListState(currentUserId, currentStudentId, currentListId))
            setLoading(false)
        }
        fetch()
    }, [currentUserId, currentStudentId, currentListId])

    useEffect(() => {
        const fetch = async () => {
            setListState(await fetchListState(currentUserId, currentStudentId, currentListId))
        }
        fetch()
    }, [currentUserId, currentStudentId, currentListId])

    const refreshState = async () => {
        setListState(await fetchListState(currentUserId, currentStudentId, currentListId))
    }

    return { listState, loading, refreshState }
}

export const useStudents = (currentUserId: string) => {
    const [students, setStudents] = useState<firebase.firestore.DocumentData[]>(
        []
    )
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetch = async () => {
            setLoading(true)
            setStudents(await fetchStudents(currentUserId))
            setLoading(false)
        }
        fetch()
    }, [currentUserId])

    const filterStudents = async (group: string) => {
        const filteredStudents = (await fetchStudents(currentUserId))
            .filter((student) => student.classes.includes(group))
            .sort((a) => (a.highlight ? -1 : 1))

        setStudents(filteredStudents)
    }

    const refreshStudents = async () => {
        setLoading(true)
        setStudents(await fetchStudents(currentUserId))
        setLoading(false)
    }

    return { students, filterStudents, refreshStudents, loading }
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

export const useUser = (currentUserId: string) => {
    const [user, setUser] = useState<firebase.firestore.DocumentData>()

    useEffect(() => {
        const fetch = async () => {
            setUser(await fetchUser(currentUserId))
        }
        fetch()
    }, [currentUserId])

    return user
}

export const useLists = (currentUserId: string, listsRefresher?: number) => {
    const [lists, setLists] = useState<firebase.firestore.DocumentData[]>([])

    useEffect(() => {
        const fetch = async () => {
            setLists(await fetchLists(currentUserId))
        }
        fetch()
    }, [currentUserId, listsRefresher])

    return lists
}

/////////////////////////////// Click outside component ////////////////////////////////////


type AnyEvent = MouseEvent | TouchEvent

function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: AnyEvent) => void,
) {
  useEffect(() => {
    const listener = (event: AnyEvent) => {
      const el = ref?.current

      // Do nothing if clicking ref's element or descendent elements
      if (!el || el.contains(event.target as Node)) {
        return
      }

      handler(event)
    }

    document.addEventListener(`mousedown`, listener)
    document.addEventListener(`touchstart`, listener)

    return () => {
      document.removeEventListener(`mousedown`, listener)
      document.removeEventListener(`touchstart`, listener)
    }

    // Reload only if ref or handler changes
  }, [ref, handler])
}

export default useOnClickOutside