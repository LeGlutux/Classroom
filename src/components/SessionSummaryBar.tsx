import React, { useEffect, useMemo, useRef, useState } from 'react'
import { handleIcon } from '../functions'
import { useSessionCrosses } from '../hooks'
import {
    countSessionCrosses,
    normalizeSessionFollow,
    sessionSummaryItems,
    sessionSummaryVisibleItems,
    sessionWindowStart,
} from '../sessionFollow'

type Slot = { type: string; icon: number; src?: string }

export type SummaryStripItem = {
    type: string
    src: string
    count: number
}

const FOLD_MS = 380

const useNow = (intervalMs: number) => {
    const [now, setNow] = useState(() => Date.now())
    useEffect(() => {
        const id = window.setInterval(() => setNow(Date.now()), intervalMs)
        return () => window.clearInterval(id)
    }, [intervalMs])
    return now
}

export const SessionSummaryStrip = ({
    items,
    open,
    animated,
}: {
    items: SummaryStripItem[]
    open: boolean
    animated?: boolean
}) => {
    return (
        <div
            className={
                'session-summary-fold' +
                (open ? ' is-open' : '') +
                (animated ? ' is-animated' : '')
            }
            aria-hidden={!open}
        >
            <div className="session-summary-fold-inner">
                <div
                    className="session-summary-bar"
                    aria-label={open ? 'Résumé de séance' : undefined}
                >
                    {items.map((item) => (
                        <span key={item.type} className="session-summary-item">
                            {item.src && item.src !== 'none' ? (
                                <img src={item.src} alt="" />
                            ) : null}
                            <span className="session-summary-count">
                                {item.count}
                            </span>
                        </span>
                    ))}
                </div>
            </div>
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
    const { crosses, ready } = useSessionCrosses(uid, studentIds)
    const mode = normalizeSessionFollow(sessionFollow)
    const visible = useMemo(() => {
        const windowStart = sessionWindowStart(new Date(now), mode)
        const counts = countSessionCrosses(crosses, windowStart)
        return sessionSummaryVisibleItems(
            sessionSummaryItems(counts, slots).map((item) => {
                const slot = slots.find((entry) => entry.type === item.type)
                const src =
                    (slot && slot.src) || handleIcon(item.icon) || ''
                return {
                    type: item.type,
                    src: src === 'none' ? '' : src,
                    count: item.count,
                }
            })
        )
    }, [crosses, now, mode, slots])

    const open = visible.length > 0
    const [shown, setShown] = useState(visible)
    const [animated, setAnimated] = useState(false)
    const shownRef = useRef(visible)
    shownRef.current = shown

    useEffect(() => {
        if (visible.length > 0) {
            setShown(visible)
            return undefined
        }
        if (shownRef.current.length === 0) return undefined
        const id = window.setTimeout(() => setShown([]), FOLD_MS)
        return () => window.clearTimeout(id)
    }, [visible])

    useEffect(() => {
        if (!ready) return undefined
        const id = window.requestAnimationFrame(() => setAnimated(true))
        return () => window.cancelAnimationFrame(id)
    }, [ready])

    return (
        <SessionSummaryStrip
            items={open ? visible : shown}
            open={open}
            animated={animated}
        />
    )
}
