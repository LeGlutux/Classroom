/**
 * Système de cache local pour Firebase
 * Stocke les données dans localStorage et ne les recharge que si nécessaire
 */

const CACHE_PREFIX = 'thot_note_cache_'
const CACHE_TIMESTAMP_SUFFIX = '_timestamp'
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 heures en millisecondes

interface CacheOptions {
    key: string
    duration?: number // Durée de validité du cache en ms
}

/**
 * Récupère une valeur depuis le cache
 */
export const getCachedData = <T>(key: string): T | null => {
    try {
        const cacheKey = `${CACHE_PREFIX}${key}`
        const timestampKey = `${cacheKey}${CACHE_TIMESTAMP_SUFFIX}`
        
        const cachedData = localStorage.getItem(cacheKey)
        const cachedTimestamp = localStorage.getItem(timestampKey)
        
        if (!cachedData || !cachedTimestamp) {
            return null
        }
        
        const age = Date.now() - parseInt(cachedTimestamp, 10)
        const duration = CACHE_DURATION
        
        // Vérifier si le cache est encore valide
        if (age > duration) {
            // Cache expiré, nettoyer
            localStorage.removeItem(cacheKey)
            localStorage.removeItem(timestampKey)
            return null
        }
        
        return JSON.parse(cachedData) as T
    } catch (error) {
        console.error('Error reading from cache:', error)
        return null
    }
}

/**
 * Sauvegarde une valeur dans le cache
 */
export const setCachedData = <T>(key: string, data: T): void => {
    try {
        const cacheKey = `${CACHE_PREFIX}${key}`
        const timestampKey = `${cacheKey}${CACHE_TIMESTAMP_SUFFIX}`
        
        localStorage.setItem(cacheKey, JSON.stringify(data))
        localStorage.setItem(timestampKey, Date.now().toString())
    } catch (error) {
        console.error('Error writing to cache:', error)
        // Si localStorage est plein, on ignore silencieusement
    }
}

/**
 * Invalide le cache pour une clé spécifique
 */
export const invalidateCache = (key: string): void => {
    const cacheKey = `${CACHE_PREFIX}${key}`
    const timestampKey = `${cacheKey}${CACHE_TIMESTAMP_SUFFIX}`
    
    localStorage.removeItem(cacheKey)
    localStorage.removeItem(timestampKey)
}

/**
 * Invalide tous les caches
 */
export const clearAllCache = (): void => {
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
        if (key.startsWith(CACHE_PREFIX)) {
            localStorage.removeItem(key)
        }
    })
}

/**
 * Génère une clé de cache basée sur l'userId et le type de données
 */
export const getCacheKey = (userId: string, dataType: string): string => {
    return `${userId}_${dataType}`
}

export const patchCachedStudent = (
    userId: string,
    studentId: string,
    patch: Record<string, unknown>
): void => {
    const key = getCacheKey(userId, 'students')
    const cached = getCachedData<Array<{ id: string }>>(key)
    if (!cached || cached.length === 0) return
    setCachedData(
        key,
        cached.map((item) =>
            item.id === studentId ? { ...item, ...patch } : item
        )
    )
}

export const removeCachedStudent = (userId: string, studentId: string): void => {
    const key = getCacheKey(userId, 'students')
    const cached = getCachedData<Array<{ id: string }>>(key)
    if (!cached || cached.length === 0) return
    setCachedData(
        key,
        cached.filter((item) => item.id !== studentId)
    )
}

