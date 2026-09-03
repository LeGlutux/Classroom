import React from 'react'

export const NoticeBadge = ({ count }: { count: number }) => {
    if (count < 1) return null
    const label =
        count === 1
            ? '1 nouveau signalement'
            : `${count} nouveaux signalements`
    return (
        <span className="notice-badge" aria-label={label}>
            {count > 9 ? '9+' : count}
        </span>
    )
}
