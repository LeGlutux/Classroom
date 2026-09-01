export const SCHOOL_YEAR_WEEKS = 52
const DAY_MS = 86400000

export const startOfLocalDay = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate())

export const mondayOnOrBefore = (date: Date) => {
    const day = startOfLocalDay(date)
    const weekday = day.getDay()
    const delta = weekday === 0 ? 6 : weekday - 1
    day.setDate(day.getDate() - delta)
    return day
}

export const schoolYearStart = (today: Date) => {
    const day = startOfLocalDay(today)
    const thisSept1 = new Date(day.getFullYear(), 8, 1)
    const sept1 =
        day.getTime() < thisSept1.getTime()
            ? new Date(day.getFullYear() - 1, 8, 1)
            : thisSept1
    return mondayOnOrBefore(sept1)
}

export const schoolWeekNumber = (today: Date) => {
    const start = schoolYearStart(today)
    const day = startOfLocalDay(today)
    const days = Math.round((day.getTime() - start.getTime()) / DAY_MS)
    return Math.max(1, Math.min(SCHOOL_YEAR_WEEKS, Math.floor(days / 7) + 1))
}

export const schoolWeekStart = (yearStart: Date, weekNumber: number) => {
    const next = new Date(yearStart.getTime())
    next.setDate(yearStart.getDate() + (weekNumber - 1) * 7)
    return next
}
