export const CARD_W = 96
export const CARD_H = 44
export const CARD_GAP = 12
export const SNAP_THRESHOLD = 12
export const LAYOUT_PAD = 24
export const MIN_SCALE = 0.35
export const MAX_SCALE = 2.8

export type Point = { x: number; y: number }
export type Positions = { [id: string]: Point }

export type StoredPlan = {
    locked: boolean
    positions: Positions
}

export type StoredPlans = { [classe: string]: StoredPlan }

export type ViewTransform = {
    scale: number
    offset: Point
}

export const clampScale = (scale: number) =>
    Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale))

export const roundPoint = (point: Point): Point => ({
    x: Math.round(point.x * 10) / 10,
    y: Math.round(point.y * 10) / 10,
})

export const layoutColumns = (count: number) => {
    if (count <= 1) return 1
    if (count <= 4) return 2
    if (count <= 9) return 3
    if (count <= 16) return 4
    if (count <= 25) return 5
    return 6
}

export const defaultLayout = (ids: string[]): Positions => {
    const cols = layoutColumns(ids.length)
    const positions: Positions = {}
    ids.forEach((id, index) => {
        const col = index % cols
        const row = Math.floor(index / cols)
        positions[id] = {
            x: LAYOUT_PAD + col * (CARD_W + CARD_GAP),
            y: LAYOUT_PAD + row * (CARD_H + CARD_GAP),
        }
    })
    return positions
}

export const boundingBox = (positions: Positions) => {
    const ids = Object.keys(positions)
    if (ids.length === 0) {
        return { x: 0, y: 0, w: 0, h: 0 }
    }
    let minX = Infinity
    let minY = Infinity
    let maxX = -Infinity
    let maxY = -Infinity
    ids.forEach((id) => {
        const point = positions[id]
        minX = Math.min(minX, point.x)
        minY = Math.min(minY, point.y)
        maxX = Math.max(maxX, point.x + CARD_W)
        maxY = Math.max(maxY, point.y + CARD_H)
    })
    return { x: minX, y: minY, w: maxX - minX, h: maxY - minY }
}

export const mergePositions = (ids: string[], saved: Positions): Positions => {
    const result: Positions = {}
    const missing: string[] = []
    ids.forEach((id) => {
        if (saved[id]) {
            result[id] = { x: saved[id].x, y: saved[id].y }
        } else {
            missing.push(id)
        }
    })
    if (missing.length === 0) {
        return result
    }
    if (Object.keys(result).length === 0) {
        return defaultLayout(missing)
    }
    const box = boundingBox(result)
    const cols = layoutColumns(Math.max(missing.length, 1))
    const startY = box.y + box.h + CARD_GAP * 2
    const startX = LAYOUT_PAD
    missing.forEach((id, index) => {
        const col = index % cols
        const row = Math.floor(index / cols)
        result[id] = {
            x: startX + col * (CARD_W + CARD_GAP),
            y: startY + row * (CARD_H + CARD_GAP),
        }
    })
    return result
}

export const prunePositions = (ids: string[], positions: Positions): Positions => {
    const next: Positions = {}
    ids.forEach((id) => {
        if (positions[id]) {
            next[id] = roundPoint(positions[id])
        }
    })
    return next
}

const closestSnap = (value: number, candidates: number[]) => {
    let best = value
    let bestDist = SNAP_THRESHOLD + 1
    candidates.forEach((candidate) => {
        const dist = Math.abs(value - candidate)
        if (dist < bestDist && dist <= SNAP_THRESHOLD) {
            bestDist = dist
            best = candidate
        }
    })
    return best
}

export const snapPosition = (
    movingId: string,
    pos: Point,
    others: Positions
): Point => {
    const candidatesX: number[] = []
    const candidatesY: number[] = []
    Object.keys(others).forEach((id) => {
        if (id === movingId) return
        const other = others[id]
        candidatesX.push(other.x)
        candidatesX.push(other.x + CARD_W + CARD_GAP)
        candidatesX.push(other.x - CARD_W - CARD_GAP)
        candidatesY.push(other.y)
        candidatesY.push(other.y + CARD_H + CARD_GAP)
        candidatesY.push(other.y - CARD_H - CARD_GAP)
    })
    return {
        x: closestSnap(pos.x, candidatesX),
        y: closestSnap(pos.y, candidatesY),
    }
}

export const findSwapTarget = (
    movingId: string,
    pos: Point,
    others: Positions
): string | null => {
    const cx = pos.x + CARD_W / 2
    const cy = pos.y + CARD_H / 2
    let best: string | null = null
    let bestDist = Infinity
    Object.keys(others).forEach((id) => {
        if (id === movingId) return
        const other = others[id]
        if (
            cx >= other.x &&
            cx <= other.x + CARD_W &&
            cy >= other.y &&
            cy <= other.y + CARD_H
        ) {
            const dx = cx - (other.x + CARD_W / 2)
            const dy = cy - (other.y + CARD_H / 2)
            const dist = dx * dx + dy * dy
            if (dist < bestDist) {
                bestDist = dist
                best = id
            }
        }
    })
    return best
}

export const swapSeats = (
    positions: Positions,
    movingId: string,
    targetId: string,
    origin: Point
): Positions => {
    const next: Positions = {}
    Object.keys(positions).forEach((id) => {
        next[id] = { x: positions[id].x, y: positions[id].y }
    })
    const targetPos = positions[targetId]
    if (!targetPos) return next
    next[movingId] = { x: targetPos.x, y: targetPos.y }
    next[targetId] = { x: origin.x, y: origin.y }
    return next
}

export const applyDrop = (
    positions: Positions,
    movingId: string,
    droppedAt: Point,
    origin: Point
): Positions => {
    const snapped = snapPosition(movingId, droppedAt, positions)
    const target = findSwapTarget(movingId, snapped, positions)
    if (target) {
        return swapSeats(positions, movingId, target, origin)
    }
    const next: Positions = {}
    Object.keys(positions).forEach((id) => {
        next[id] = { x: positions[id].x, y: positions[id].y }
    })
    next[movingId] = snapped
    return next
}

export const fitView = (
    positions: Positions,
    viewportW: number,
    viewportH: number,
    padding = 28
): ViewTransform => {
    const box = boundingBox(positions)
    if (box.w <= 0 || box.h <= 0 || viewportW <= 0 || viewportH <= 0) {
        return { scale: 1, offset: { x: padding, y: padding } }
    }
    const scale = clampScale(
        Math.min(
            (viewportW - padding * 2) / box.w,
            (viewportH - padding * 2) / box.h,
            1.35
        )
    )
    return {
        scale,
        offset: {
            x: (viewportW - box.w * scale) / 2 - box.x * scale,
            y: (viewportH - box.h * scale) / 2 - box.y * scale,
        },
    }
}

export const zoomAround = (
    current: ViewTransform,
    nextScale: number,
    pivot: Point
): ViewTransform => {
    const scale = clampScale(nextScale)
    const worldX = (pivot.x - current.offset.x) / current.scale
    const worldY = (pivot.y - current.offset.y) / current.scale
    return {
        scale,
        offset: {
            x: pivot.x - worldX * scale,
            y: pivot.y - worldY * scale,
        },
    }
}

export const screenToWorld = (screen: Point, view: ViewTransform): Point => ({
    x: (screen.x - view.offset.x) / view.scale,
    y: (screen.y - view.offset.y) / view.scale,
})

export const parseStoredPlans = (raw: unknown): StoredPlans => {
    if (!raw || typeof raw !== 'object') return {}
    const source = raw as { [classe: string]: unknown }
    const out: StoredPlans = {}
    Object.keys(source).forEach((classe) => {
        const plan = source[classe]
        if (!plan || typeof plan !== 'object') return
        const record = plan as { locked?: unknown; positions?: unknown }
        const positions: Positions = {}
        const pos = record.positions
        if (pos && typeof pos === 'object') {
            const map = pos as { [id: string]: unknown }
            Object.keys(map).forEach((id) => {
                const point = map[id]
                if (!point || typeof point !== 'object') return
                const xy = point as { x?: unknown; y?: unknown }
                if (typeof xy.x === 'number' && typeof xy.y === 'number') {
                    positions[id] = { x: xy.x, y: xy.y }
                }
            })
        }
        out[classe] = { locked: record.locked === true, positions }
    })
    return out
}
