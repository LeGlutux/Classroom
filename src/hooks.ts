import firebase from 'firebase'
import { useState, useEffect, RefObject } from 'react'
import { StudentInterface } from './interfaces/Student'
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
    fetchComment,
    fetchStudentsIds,
    fetchAllUsersIds,
    fetchVersion,
    fetchIcons,
    fetchPostIts,
} from './database'

export const usePostIts = (currentUserId: string) => {
    const [postIts, setPostIts] = useState<{ classe: string, content: string }[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetch = async () => {
            setLoading(true)
            setPostIts(await fetchPostIts(currentUserId))
            setLoading(false)
        }
        fetch()
    }, [currentUserId])

    const refreshPostIt = async () => {
        setLoading(true)
        setPostIts(await fetchPostIts(currentUserId))
        setLoading(false)
    }

    return { postIts, loading, refreshPostIt }
}

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

export const useCrosses = (currentUserId: string, allStudentsIds: string[]) => {
    const [crosses, setCrosses] =
        useState<{ id: string; docs: firebase.firestore.DocumentData[] }[]>()

    useEffect(() => {
        const fetch = async () => {
            setCrosses(await fetchCrosses(currentUserId, allStudentsIds))
        }
        fetch()
    }, [currentUserId, allStudentsIds])

    const refreshCrosses = async () => {
        setCrosses(await fetchCrosses(currentUserId, allStudentsIds))
    }

    return { crosses, refreshCrosses }
}

export const useCross = (
    currentUserId: string,
    currentStudentId: string,
    refresher?: number
) => {
    const [cross, setCross] = useState<firebase.firestore.DocumentData[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetch = async () => {
            setLoading(true)
            setCross(await fetchCross(currentUserId, currentStudentId))
            setLoading(false)
        }
        fetch()
    }, [currentUserId, currentStudentId, refresher])

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

export const useListState = (
    currentUserId: string,
    currentStudentId: string,
    currentListId: string
) => {
    const [listState, setListState] = useState<number[]>([0, 0, 0, 0, 0])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetch = async () => {
            setLoading(true)
            setListState(
                await fetchListState(
                    currentUserId,
                    currentStudentId,
                    currentListId
                )
            )
            setLoading(false)
        }
        fetch()
    }, [currentUserId, currentStudentId, currentListId])

    useEffect(() => {
        const fetch = async () => {
            setListState(
                await fetchListState(
                    currentUserId,
                    currentStudentId,
                    currentListId
                )
            )
        }
        fetch()
    }, [currentUserId, currentStudentId, currentListId])

    const refreshState = async () => {
        setListState(
            await fetchListState(currentUserId, currentStudentId, currentListId)
        )
    }

    return { listState, loading, refreshState }
}

export const useStudents = (currentUserId: string) => {
    const [students, setStudents] = useState<StudentInterface[]>([]);
    const [allIds, setAllIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            const studentData = await fetchStudents(currentUserId);
            setStudents(studentData);
            setAllIds(await fetchStudentsIds(currentUserId));
            setLoading(false);
        };
        fetch();
    }, [currentUserId]);

    const filterStudents = async (group: string) => {
        const filteredStudents = students
            .filter((student) => student.classes.includes(group))
            .sort((a) => (a.highlight ? -1 : 1));

        setStudents(filteredStudents);
    };

    const refreshStudents = async () => {
        setLoading(true);
        const studentData = await fetchStudents(currentUserId);
        setStudents(studentData);
        setLoading(false);
    };

    return { students, filterStudents, refreshStudents, loading, allIds };
};

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

    const [runningPeriode, setRunningPeriode] = useState<number>(1)

    useEffect(() => {
        const fetch = async () => {
            setRunningPeriode(await fetchRunningPeriode(currentUserId))
        }
        fetch()
    }, [currentUserId])

    const refreshRunningPeriode = async () => {
        setRunningPeriode(await fetchRunningPeriode(currentUserId))
    }

    return { periodes, refreshPeriodes, runningPeriode, refreshRunningPeriode }
}

export const usePaths = () => {
    const [paths, setPaths] = useState<string[]>([])

    useEffect(() => {
        const fetch = async () => {
            setPaths(await fetchPaths())
        }
        fetch()
    }, [])

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
    const refreshUser = async () => setUser(await fetchUser(currentUserId))

    return { user, refreshUser }
}

export const useAllUsersIds = (currentUserId: string) => {
    const [allUserIds, setAllUsersIds] = useState<string[]>([])

    useEffect(() => {
        const fetch = async () => {
            setAllUsersIds(await fetchAllUsersIds(currentUserId))
        }
        fetch()
    }, [currentUserId])

    return allUserIds
}

export const useLists = (currentUserId: string, listsRefresher?: number) => {
    const [lists, setLists] = useState<firebase.firestore.DocumentData[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetch = async () => {
            setLoading(true)
            setLists(await fetchLists(currentUserId))
            setLoading(false)
        }
        fetch()
    }, [currentUserId, listsRefresher])

    return { lists, loading }
}

export const useComment = (currentUserId: string, currentStudentId: string) => {
    const [comment, setComment] = useState('')

    useEffect(() => {
        const fetch = async () => {
            setComment(await fetchComment(currentUserId, currentStudentId))
        }
        fetch()
    }, [currentUserId, currentStudentId])

    const refreshComment = async () =>
        setComment(await fetchComment(currentUserId, currentStudentId))

    return { comment, refreshComment }
}

export const useVersion = () => {
    const [version, setVersion] = useState<number>(-1)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetch = async () => {
            setLoading(true)
            setVersion(await fetchVersion())
            setLoading(false)
        }
        fetch()
    }, [])

    return { version, loading }
}

export const useIcons = (currentUserId: string) => {
    const [icons, setIcons] = useState<number[]>([1, 2, 3, 4, 0, 0])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetch = async () => {
            setLoading(true)
            setIcons(await fetchIcons(currentUserId))
            setLoading(false)
        }
        fetch()
    }, [currentUserId])

    return { icons, loading }
}

/////////////////////////////// Click outside component ////////////////////////////////////

type AnyEvent = MouseEvent | TouchEvent

function useOnClickOutside<T extends HTMLElement = HTMLElement>(
    ref: RefObject<T>,
    handler: (event: AnyEvent) => void
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

/////////////////////////////// Get if element is on viewport ////////////////////////////////////

export const useOnScreen = (ref: React.RefObject<HTMLDivElement>) => {
    const [isIntersecting, setIntersecting] = useState(false)

    const observer = new IntersectionObserver(([entry]) =>
        setIntersecting(entry.isIntersecting)
    )

    useEffect(() => {
        observer.observe(ref.current!)
        // Remove the observer as soon as the component is unmounted
        return () => {
            observer.disconnect()
        }
    }, [ref, observer])

    return isIntersecting
}
