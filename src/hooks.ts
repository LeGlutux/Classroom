import firebase from 'firebase/app'
import { useState, useEffect, RefObject, useRef, useCallback } from 'react'
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
    fetchAllUsersIds,
    fetchVersion,
    fetchIcons,
    fetchPostIts,
    saveNameColorRules,
} from './database'
import { parseSmsConfig, SmsTemplate } from './sms'
import { parseNameColorRules, NameColorRule } from './utils/nameColors'
import Firebase from './firebase'
import { getCachedData, setCachedData, getCacheKey, invalidateCache } from './utils/cache'
import { filterStudentsByGroup } from './utils/studentsList'

export const usePostIts = (currentUserId: string) => {
    const [postIts, setPostIts] = useState<{ classe: string, content: string }[]>([])
    const [loading, setLoading] = useState(false)
    const isMountedRef = useRef(true)

    useEffect(() => {
        isMountedRef.current = true
        const fetch = async () => {
            setLoading(true)
            const data = await fetchPostIts(currentUserId)
            if (isMountedRef.current) {
                setPostIts(Array.isArray(data) ? data : [])
                setLoading(false)
            }
        }
        fetch()
        
        return () => {
            isMountedRef.current = false
        }
    }, [currentUserId])

    const refreshPostIt = async () => {
        if (!isMountedRef.current) return
        setLoading(true)
        const data = await fetchPostIts(currentUserId)
        if (isMountedRef.current) {
            setPostIts(Array.isArray(data) ? data : [])
            setLoading(false)
        }
    }

    return { postIts, setPostIts, loading, refreshPostIt }
}

export const useGroups = (currentUserId: string) => {
    const [groups, setGroups] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const cacheKey = getCacheKey(currentUserId, 'groups')
    const isMountedRef = useRef(true)

    useEffect(() => {
        if (!currentUserId) return;
        
        isMountedRef.current = true

        // 1. Charger depuis le cache immédiatement
        const cachedData = getCachedData<string[]>(cacheKey);
        if (cachedData && cachedData.length > 0) {
            if (isMountedRef.current) {
                setGroups(cachedData);
                setLoading(false);
            }
        }

        // 2. Écouter les changements dans le document utilisateur
        const unsubscribe = Firebase.firestore()
            .collection('users')
            .doc(currentUserId)
            .onSnapshot(
                (doc) => {
                    if (!isMountedRef.current) return
                    
                    const userData = doc.data();
                    const userGroups = userData?.classes || [];
                    
                    setGroups(userGroups);
                    setCachedData(cacheKey, userGroups);
                    setLoading(false);
                },
                (error) => {
                    if (!isMountedRef.current) return
                    console.error('Error in groups listener:', error);
                    setLoading(false);
                }
            );

        // 3. Charger depuis Firestore si pas de cache
        if (!cachedData || cachedData.length === 0) {
            setLoading(true);
            fetchGroups(currentUserId)
                .then((groupsData) => {
                    if (isMountedRef.current) {
                        setGroups(groupsData);
                        setCachedData(cacheKey, groupsData);
                        setLoading(false);
                    }
                })
                .catch((error) => {
                    if (!isMountedRef.current) return
                    console.error('Error fetching groups:', error);
                    setLoading(false);
                });
        }

        return () => {
            isMountedRef.current = false
            unsubscribe()
        }
    }, [currentUserId, cacheKey])

    const refreshGroups = async () => {
        if (!isMountedRef.current) return
        setLoading(true)
        invalidateCache(cacheKey);
        const groupsData = await fetchGroups(currentUserId)
        if (isMountedRef.current) {
            setGroups(groupsData)
            setCachedData(cacheKey, groupsData);
            setLoading(false)
        }
    }

    return { groups, loading, refreshGroups }
}

export const useCrosses = (currentUserId: string, allStudentsIds: string[]) => {
    const [crosses, setCrosses] =
        useState<{ id: string; docs: firebase.firestore.DocumentData[] }[]>()
    const isMountedRef = useRef(true)
    const idsKey = (allStudentsIds || []).join(',')

    useEffect(() => {
        isMountedRef.current = true
        const ids = idsKey ? idsKey.split(',') : []
        const fetch = async () => {
            const data = await fetchCrosses(currentUserId, ids)
            if (isMountedRef.current) {
                setCrosses(data)
            }
        }
        fetch()
        
        return () => {
            isMountedRef.current = false
        }
    }, [currentUserId, idsKey])

    const refreshCrosses = async () => {
        const ids = idsKey ? idsKey.split(',') : []
        const data = await fetchCrosses(currentUserId, ids)
        if (isMountedRef.current) {
            setCrosses(data)
        }
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
    const isMountedRef = useRef(true)

    useEffect(() => {
        isMountedRef.current = true
        const fetch = async () => {
            setLoading(true)
            const data = await fetchCross(currentUserId, currentStudentId)
            if (isMountedRef.current) {
                setCross(data)
                setLoading(false)
            }
        }
        fetch()
        
        return () => {
            isMountedRef.current = false
        }
    }, [currentUserId, currentStudentId, refresher])

    const refreshCross = async () => {
        const data = await fetchCross(currentUserId, currentStudentId)
        if (isMountedRef.current) {
            setCross(data)
        }
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
    const isMountedRef = useRef(true)

    useEffect(() => {
        isMountedRef.current = true
        const fetch = async () => {
            setLoading(true)
            const data = await fetchListState(
                currentUserId,
                currentStudentId,
                currentListId
            )
            if (isMountedRef.current) {
                setListState(data)
                setLoading(false)
            }
        }
        fetch()
        
        return () => {
            isMountedRef.current = false
        }
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
    const allStudentsRef = useRef<StudentInterface[]>([]); // Cache des étudiants non filtrés
    const filterGroupRef = useRef<string | null>(null)
    const cacheKey = getCacheKey(currentUserId, 'students');
    const isMountedRef = useRef(true);

    useEffect(() => {
        if (!currentUserId) return;

        isMountedRef.current = true

        // 1. Charger depuis le cache immédiatement (instantané)
        const cachedData = getCachedData<StudentInterface[]>(cacheKey);
        if (cachedData && cachedData.length > 0) {
            if (isMountedRef.current) {
                setStudents(cachedData);
                allStudentsRef.current = cachedData;
                setAllIds(cachedData.map((s) => s.id));
                setLoading(false);
            }
        }

        // 2. Mettre en place un listener pour détecter les changements
        const unsubscribe = Firebase.firestore()
            .collection('users')
            .doc(currentUserId)
            .collection('eleves')
            .orderBy('name')
            .onSnapshot(
                (snapshot) => {
                    if (!isMountedRef.current) return
                    
                    const studentData: StudentInterface[] = snapshot.docs.map((doc) => {
                        const data = doc.data();
                        return {
                            id: doc.id,
                            name: data.name,
                            surname: data.surname,
                            classes: data.classes,
                            highlight: data.highlight,
                            selected: data.selected,
                            comment: data.comment,
                            crosses: data.crosses || [],
                        } as StudentInterface;
                    });

                    allStudentsRef.current = studentData;
                    setCachedData(cacheKey, studentData);
                    setAllIds(studentData.map((s) => s.id));
                    if (filterGroupRef.current != null) {
                        setStudents(
                            filterStudentsByGroup(
                                studentData,
                                filterGroupRef.current
                            )
                        )
                    } else {
                        setStudents(studentData)
                    }
                    setLoading(false);
                },
                (error) => {
                    if (!isMountedRef.current) return
                    console.error('Error in students listener:', error);
                    setLoading(false);
                }
            );

        // 3. Charger depuis Firestore si pas de cache (première fois)
        if (!cachedData || cachedData.length === 0) {
            setLoading(true);
            fetchStudents(currentUserId)
                .then((studentData) => {
                    if (isMountedRef.current) {
                        allStudentsRef.current = studentData;
                        setStudents(studentData);
                        setAllIds(studentData.map((s) => s.id));
                        setCachedData(cacheKey, studentData);
                        setLoading(false);
                    }
                })
                .catch((error) => {
                    if (!isMountedRef.current) return
                    console.error('Error fetching students:', error);
                    setLoading(false);
                });
        }

        return () => {
            isMountedRef.current = false
            unsubscribe()
        }
    }, [currentUserId, cacheKey]);

    // filterStudents utilise maintenant le cache local, pas de rechargement
    const filterStudents = useCallback((group: string) => {
        filterGroupRef.current = group
        setStudents(filterStudentsByGroup(allStudentsRef.current, group));
    }, []);

    const refreshStudents = async () => {
        if (!isMountedRef.current) return
        setLoading(true);
        invalidateCache(cacheKey);
        const studentData = await fetchStudents(currentUserId);
        if (isMountedRef.current) {
            allStudentsRef.current = studentData;
            setAllIds(studentData.map((s) => s.id));
            setCachedData(cacheKey, studentData);
            if (filterGroupRef.current != null) {
                setStudents(
                    filterStudentsByGroup(studentData, filterGroupRef.current)
                )
            } else {
                setStudents(studentData)
            }
            setLoading(false);
        }
    };

    return { students, filterStudents, refreshStudents, loading, allIds };
};

export const usePeriodes = (currentUserId: string) => {
    const [periodes, setPeriodes] = useState<Date[]>([])
    const [runningPeriode, setRunningPeriode] = useState<number>(1)
    const periodesCacheKey = getCacheKey(currentUserId, 'periodes')
    const runningPeriodeCacheKey = getCacheKey(currentUserId, 'runningPeriode')
    const isMountedRef = useRef(true)

    useEffect(() => {
        if (!currentUserId) return;

        isMountedRef.current = true

        // 1. Charger depuis le cache
        const cachedPeriodes = getCachedData<Date[]>(periodesCacheKey);
        const cachedRunningPeriode = getCachedData<number>(runningPeriodeCacheKey);
        
        if (cachedPeriodes && isMountedRef.current) {
            setPeriodes(cachedPeriodes);
        }
        if (cachedRunningPeriode !== null && isMountedRef.current) {
            setRunningPeriode(cachedRunningPeriode);
        }

        // 2. Écouter les changements
        const unsubscribe = Firebase.firestore()
            .collection('users')
            .doc(currentUserId)
            .onSnapshot(
                (doc) => {
                    if (!isMountedRef.current) return
                    
                    const userData = doc.data();
                    if (userData?.periodes) {
                        const periodesData = userData.periodes.map((p: any) => 
                            p?.toDate ? p.toDate() : new Date(p)
                        );
                        setPeriodes(periodesData);
                        setCachedData(periodesCacheKey, periodesData);
                    }
                    if (userData?.runningPeriode !== undefined) {
                        setRunningPeriode(userData.runningPeriode);
                        setCachedData(runningPeriodeCacheKey, userData.runningPeriode);
                    }
                },
                (error) => {
                    if (!isMountedRef.current) return
                    console.error('Error in periodes listener:', error);
                }
            );

        // 3. Charger depuis Firestore si pas de cache
        if (!cachedPeriodes) {
            fetchPeriodes(currentUserId)
                .then((periodesData) => {
                    if (isMountedRef.current) {
                        setPeriodes(periodesData);
                        setCachedData(periodesCacheKey, periodesData);
                    }
                })
                .catch((error) => {
                    if (!isMountedRef.current) return
                    console.error('Error fetching periodes:', error);
                });
        }

        if (cachedRunningPeriode === null) {
            fetchRunningPeriode(currentUserId)
                .then((runningPeriodeData) => {
                    if (isMountedRef.current) {
                        setRunningPeriode(runningPeriodeData);
                        setCachedData(runningPeriodeCacheKey, runningPeriodeData);
                    }
                })
                .catch((error) => {
                    if (!isMountedRef.current) return
                    console.error('Error fetching runningPeriode:', error);
                });
        }

        return () => {
            isMountedRef.current = false
            unsubscribe()
        }
    }, [currentUserId, periodesCacheKey, runningPeriodeCacheKey])

    const refreshPeriodes = async () => {
        if (!isMountedRef.current) return
        invalidateCache(periodesCacheKey);
        const periodesData = await fetchPeriodes(currentUserId)
        if (isMountedRef.current) {
            setPeriodes(periodesData)
            setCachedData(periodesCacheKey, periodesData);
        }
    }

    const refreshRunningPeriode = async () => {
        if (!isMountedRef.current) return
        invalidateCache(runningPeriodeCacheKey);
        const runningPeriodeData = await fetchRunningPeriode(currentUserId)
        if (isMountedRef.current) {
            setRunningPeriode(runningPeriodeData)
            setCachedData(runningPeriodeCacheKey, runningPeriodeData);
        }
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
    const isMountedRef = useRef(true)

    useEffect(() => {
        isMountedRef.current = true
        const fetch = async () => {
            const data = await fetchStudentWithId(currentUserId, studentId)
            if (isMountedRef.current) {
                setStudent(data)
            }
        }
        fetch()
        
        return () => {
            isMountedRef.current = false
        }
    }, [currentUserId, studentId])

    return student
}

export const useUser = (currentUserId: string) => {
    const [user, setUser] = useState<firebase.firestore.DocumentData>()
    const isMountedRef = useRef(true)

    useEffect(() => {
        isMountedRef.current = true
        const fetch = async () => {
            const userData = await fetchUser(currentUserId)
            if (isMountedRef.current) {
                setUser(userData)
            }
        }
        fetch()
        
        return () => {
            isMountedRef.current = false
        }
    }, [currentUserId])
    
    const refreshUser = async () => {
        const userData = await fetchUser(currentUserId)
        if (isMountedRef.current) {
            setUser(userData)
        }
    }

    return { user, refreshUser }
}

export const useAllUsersIds = (currentUserId: string) => {
    const [allUserIds, setAllUsersIds] = useState<string[]>([])
    const isMountedRef = useRef(true)

    useEffect(() => {
        isMountedRef.current = true
        const fetch = async () => {
            const data = await fetchAllUsersIds(currentUserId)
            if (isMountedRef.current) {
                setAllUsersIds(data)
            }
        }
        fetch()
        
        return () => {
            isMountedRef.current = false
        }
    }, [currentUserId])

    return allUserIds
}

export const useLists = (currentUserId: string, listsRefresher?: number) => {
    const [lists, setLists] = useState<firebase.firestore.DocumentData[]>([])
    const [loading, setLoading] = useState(true)
    const isMountedRef = useRef(true)

    useEffect(() => {
        isMountedRef.current = true
        const fetch = async () => {
            setLoading(true)
            const data = await fetchLists(currentUserId)
            if (isMountedRef.current) {
                setLists(data)
                setLoading(false)
            }
        }
        fetch()
        
        return () => {
            isMountedRef.current = false
        }
    }, [currentUserId, listsRefresher])

    return { lists, loading }
}

export const useComment = (currentUserId: string, currentStudentId: string) => {
    const [comment, setComment] = useState('')
    const isMountedRef = useRef(true)

    useEffect(() => {
        isMountedRef.current = true
        const fetch = async () => {
            const data = await fetchComment(currentUserId, currentStudentId)
            if (isMountedRef.current) {
                setComment(data)
            }
        }
        fetch()
        
        return () => {
            isMountedRef.current = false
        }
    }, [currentUserId, currentStudentId])

    const refreshComment = async () => {
        const data = await fetchComment(currentUserId, currentStudentId)
        if (isMountedRef.current) {
            setComment(data)
        }
    }

    return { comment, refreshComment }
}

export const useVersion = () => {
    const [version, setVersion] = useState<number>(-1)
    const [loading, setLoading] = useState(true)
    const isMountedRef = useRef(true)

    useEffect(() => {
        isMountedRef.current = true
        const fetch = async () => {
            setLoading(true)
            const data = await fetchVersion()
            if (isMountedRef.current) {
                setVersion(data)
                setLoading(false)
            }
        }
        fetch()
        
        return () => {
            isMountedRef.current = false
        }
    }, [])

    return { version, loading }
}

export const useSmsConfig = () => {
    const [smsEnabled, setSmsEnabled] = useState(false)
    const [defaultTemplates, setDefaultTemplates] = useState<SmsTemplate[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsub = Firebase.firestore()
            .collection('props')
            .doc('sms-config')
            .onSnapshot(
                (snap) => {
                    const parsed = parseSmsConfig(snap.data())
                    setSmsEnabled(parsed.smsEnabled)
                    setDefaultTemplates(parsed.defaultTemplates)
                    setLoading(false)
                },
                () => {
                    setLoading(false)
                }
            )
        return () => unsub()
    }, [])

    return { smsEnabled, defaultTemplates, loading }
}

export const useNameColorRules = (currentUserId: string) => {
    const [rules, setRules] = useState<NameColorRule[]>(
        parseNameColorRules(undefined)
    )
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (!currentUserId) {
            setRules(parseNameColorRules(undefined))
            setLoading(false)
            return
        }
        setLoading(true)
        const unsub = Firebase.firestore()
            .collection('users')
            .doc(currentUserId)
            .onSnapshot(
                (snap) => {
                    setRules(parseNameColorRules(snap.data()?.nameColorRules))
                    setLoading(false)
                },
                () => {
                    setLoading(false)
                }
            )
        return () => unsub()
    }, [currentUserId])

    const save = async (next: NameColorRule[]) => {
        if (!currentUserId) return
        setSaving(true)
        try {
            await saveNameColorRules(currentUserId, next)
            setRules(next)
        } finally {
            setSaving(false)
        }
    }

    return { rules, loading, saving, save }
}

export const useIcons = (currentUserId: string) => {
    const [icons, setIcons] = useState<number[]>([1, 2, 3, 4, 0, 0])
    const [positiveIcons, setPositiveIcons] = useState<number[]>([
        0, 0, 0, 0, 0, 0,
    ])
    const [loading, setLoading] = useState(true)
    const isMountedRef = useRef(true)

    useEffect(() => {
        isMountedRef.current = true
        const fetch = async () => {
            if (!currentUserId) {
                if (isMountedRef.current) setLoading(false)
                return
            }
            setLoading(true)
            const data = await fetchIcons(currentUserId)
            if (isMountedRef.current) {
                setIcons(data.icons)
                setPositiveIcons(data.positiveIcons)
                setLoading(false)
            }
        }
        fetch()
        
        return () => {
            isMountedRef.current = false
        }
    }, [currentUserId])

    return { icons, positiveIcons, loading }
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
