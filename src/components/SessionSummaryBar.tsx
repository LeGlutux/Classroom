import React, { useEffect, useMemo, useState } from 'react'
import { handleIcon } from '../functions'
import { useSessionCrosses } from '../hooks'
import {
    countSessionCrosses,
    normalizeSessionFollow,
    sessionSummaryItems,
    sessionWindowStart,
} from '../sessionFollow'

type Slot = { type: string; icon: number; src?: string }

export type SummaryStripItem = {
    type: string
    src: string
    count: number
}

const useNow = (intervalMs: number) => {
    const [now, setNow] = useState(() => Date.now())
    useEffect(() => {
        const id = window.setInterval(() => setNow(Date.now()), intervalMs)
        return () => window.clearInterval(id)
    }, [intervalMs])
    return now
}

export const SessionSummaryStrip = ({ items }: { items: SummaryStripItem[] }) => {
    if (items.length === 0) return null
    return (
        <div className="session-summary-bar" aria-label="Résumé de séance">
            {items.map((item) => (
                <span key={item.type} className="session-summary-item">
                    {item.src && item.src !== 'none' ? (
                        <img src={item.src} alt="" />
                    ) : null}
                    <span className="session-summary-count">{item.count}</span>
                </span>
            ))}
        </div>
    )
}

export default ({
    uid,
    studentIds,
    slots,
    sessionFollow,
}: {
    uid: string
    studentIds: string[]
    slots: Slot[]
    sessionFollow?: unknown
}) => {
    const now = useNow(15000)
    const crosses = useSessionCrosses(uid, studentIds)
    const mode = normalizeSessionFollow(sessionFollow)
    const items = useMemo(() => {
        const windowStart = sessionWindowStart(new Date(now), mode)
        const counts = countSessionCrosses(crosses, windowStart)
        return sessionSummaryItems(counts, slots).map((item) => {
            const slot = slots.find((entry) => entry.type === item.type)
            const src =
                (slot && slot.src) ||
                handleIcon(item.icon) ||
                ''
            return {
                type: item.type,
                src: src === 'none' ? '' : src,
                count: item.count,
            }
        })
    }, [crosses, now, mode, slots])

    return <SessionSummaryStrip items={items} />
}
