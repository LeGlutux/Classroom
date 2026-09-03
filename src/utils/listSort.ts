export const EMPTY_LIST_STATE = [0, 0, 0, 0, 0]

export const normalizeListState = (value: unknown): number[] => {
    const source = Array.isArray(value) ? value : []
    return [0, 1, 2, 3, 4].map((index) => {
        const cell = source[index]
        if (cell === 1 || cell === 2 || cell === 3) return cell
        return 0
    })
}

export const listStatusSortRank = (state: number) => {
    if (state === 2) return 1
    if (state === 3) return 2
    if (state === 1) return 3
    return 0
}

const alphaName = (
    a: { name?: string; surname?: string },
    b: { name?: string; surname?: string }
) => {
    const byName = String(a.name || '').localeCompare(String(b.name || ''), 'fr', {
        sensitivity: 'base',
    })
    if (byName) return byName
    return String(a.surname || '').localeCompare(String(b.surname || ''), 'fr', {
        sensitivity: 'base',
    })
}

export const compareStudentsByListColumn = (
    a: { id: string; name?: string; surname?: string },
    b: { id: string; name?: string; surname?: string },
    columnIndex: number | null,
    statesByStudent: { [id: string]: number[] }
) => {
    if (columnIndex === null || columnIndex < 0) return alphaName(a, b)
    const rankA = listStatusSortRank(
        normalizeListState(statesByStudent[a.id])[columnIndex] || 0
    )
    const rankB = listStatusSortRank(
        normalizeListState(statesByStudent[b.id])[columnIndex] || 0
    )
    if (rankA !== rankB) return rankA - rankB
    return alphaName(a, b)
}

export const sortStudentsByListColumn = <
    T extends { id: string; name?: string; surname?: string }
>(
    students: T[],
    columnIndex: number | null,
    statesByStudent: { [id: string]: number[] }
) =>
    students
        .slice()
        .sort((a, b) =>
            compareStudentsByListColumn(a, b, columnIndex, statesByStudent)
        )
