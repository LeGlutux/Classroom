export const CARD_W = 72
export const CARD_H = 60
export const CARD_GAP = -1
export const SNAP_THRESHOLD = 16
export const MAX_SEAT_CHARS = 8
export const LINK_EPS = 2.5
export const CLUSTER_OUTLINE = 2.5
export const LAYOUT_PAD = 24
export const MIN_SCALE = 0.35
export const MAX_SCALE = 2.8
export const ZOOM_STEP = 1.15
export const DOUBLE_TAP_ZOOM_STEPS = 3
export const DOUBLE_TAP_MS = 340
export const DOUBLE_TAP_PX = 30

export type TapPoint = { time: number; x: number; y: number }

export const isDoubleTap = (
    last: TapPoint | null,
    next: TapPoint,
    windowMs = DOUBLE_TAP_MS,
    maxDist = DOUBLE_TAP_PX
) => {
    if (!last) return false
    return (
        next.time - last.time <= windowMs &&
        Math.hypot(next.x - last.x, next.y - last.y) <= maxDist
    )
}

export const clampScale = (scale: number) =>
    Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale))

export const steppedZoomScale = (scale: number, steps: number) =>
    clampScale(scale * Math.pow(ZOOM_STEP, steps))

export type Point = { x: number; y: number; name?: string; surname?: string }
export type Positions = { [id: string]: Point }

export type SeatIdentity = {
    id: string
    name?: string
    surname?: string
}

const normalizePersonPart = (value?: string) =>
    String(value || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, ' ')
        .trim()

export const seatPersonKey = (name?: string, surname?: string) => {
    const key = normalizePersonPart(name) + '|' + normalizePersonPart(surname)
    return key === '|' ? '' : key
}

export const copySeat = (point: Point, identity?: SeatIdentity): Point => {
    const next: Point = { x: point.x, y: point.y }
    const name =
        identity && identity.name != null && String(identity.name).trim()
            ? String(identity.name).trim()
            : point.name
    const surname =
        identity && identity.surname != null && String(identity.surname).trim()
            ? String(identity.surname).trim()
            : point.surname
    if (name) next.name = name
    if (surname) next.surname = surname
    return next
}

export const stampSeatIdentities = (
    positions: Positions,
    roster: SeatIdentity[]
): Positions => {
    const byId: { [id: string]: SeatIdentity } = {}
    roster.forEach((item) => {
        if (item && item.id) byId[item.id] = item
    })
    const next: Positions = {}
    Object.keys(positions).forEach((id) => {
        next[id] = copySeat(positions[id], byId[id])
    })
    return next
}

export const EMPTY_SEAT_PREFIX = 'blank:'

export const isEmptySeatId = (id: string) =>
    id.indexOf(EMPTY_SEAT_PREFIX) === 0

export const emptySeatIds = (positions: Positions) =>
    Object.keys(positions).filter(isEmptySeatId)

export const nextEmptySeatId = (positions: Positions) => {
    let max = 0
    emptySeatIds(positions).forEach((id) => {
        const n = Number(id.slice(EMPTY_SEAT_PREFIX.length))
        if (Number.isFinite(n) && n > max) max = n
    })
    return EMPTY_SEAT_PREFIX + (max + 1)
}

export const seatsOverlap = (a: Point, b: Point) =>
    Math.abs(a.x - b.x) < CARD_W - 1 && Math.abs(a.y - b.y) < CARD_H - 1

export const removeSeat = (positions: Positions, id: string): Positions => {
    const next: Positions = {}
    Object.keys(positions).forEach((key) => {
        if (key !== id) next[key] = positions[key]
    })
    return next
}

export type StoredPlan = {
    locked: boolean
    positions: Positions
}

export type StoredPlans = { [classe: string]: StoredPlan }

export type ViewTransform = {
    scale: number
    offset: Point
}

export const roundPoint = (point: Point): Point => ({
    x: Math.round(point.x * 10) / 10,
    y: Math.round(point.y * 10) / 10,
})

export type SeatCaption = {
    line1: string
    line2: string
    hint: string
}

export const clipSeatText = (text: string, max: number) => {
    const value = (text || '').trim()
    if (value.length <= max) return value
    if (max <= 1) return '…'
    return value.substring(0, max - 1) + '…'
}

export const splitGivenName = (surname: string): { head: string; tail: string } => {
    const text = (surname || '').trim()
    if (!text) return { head: '', tail: '' }
    const hyphen = text.indexOf('-')
    const space = text.indexOf(' ')
    let cut = -1
    if (hyphen >= 0 && space >= 0) cut = Math.min(hyphen, space)
    else if (hyphen >= 0) cut = hyphen
    else cut = space
    if (cut <= 0) return { head: text, tail: '' }
    return {
        head: text.slice(0, cut).trim(),
        tail: text.slice(cut + 1).trim(),
    }
}

export const givenNameKey = (surname: string) =>
    (surname || '').trim().toLowerCase()

export const lastNameHint = (name: string) => (name || '').trim().substring(0, 3)

export const seatCaption = (
    student: { surname: string; name: string },
    classmates: { surname: string }[]
): SeatCaption => {
    const parts = splitGivenName(student.surname)
    const key = givenNameKey(student.surname)
    const twins =
        classmates.filter((mate) => givenNameKey(mate.surname) === key)
            .length > 1
    const hint = twins ? lastNameHint(student.name) : ''
    return {
        line1: clipSeatText(parts.head, MAX_SEAT_CHARS),
        line2: clipSeatText(parts.tail, MAX_SEAT_CHARS),
        hint,
    }
}

export const seatsTouching = (a: Point, b: Point, eps = LINK_EPS) => {
    const hTouch =
        Math.abs(a.x + CARD_W - b.x) <= eps ||
        Math.abs(b.x + CARD_W - a.x) <= eps
    const vOverlap = a.y < b.y + CARD_H - 1 && b.y < a.y + CARD_H - 1
    const vTouch =
        Math.abs(a.y + CARD_H - b.y) <= eps ||
        Math.abs(b.y + CARD_H - a.y) <= eps
    const hOverlap = a.x < b.x + CARD_W - 1 && b.x < a.x + CARD_W - 1
    return (hTouch && vOverlap) || (vTouch && hOverlap)
}

export const linkedSeatGroups = (positions: Positions): string[][] => {
    const ids = Object.keys(positions)
    const parent: { [id: string]: string } = {}
    ids.forEach((id) => {
        parent[id] = id
    })
    const find = (id: string): string => {
        if (parent[id] !== id) parent[id] = find(parent[id])
        return parent[id]
    }
    const unite = (a: string, b: string) => {
        const pa = find(a)
        const pb = find(b)
        if (pa !== pb) parent[pa] = pb
    }
    for (let i = 0; i < ids.length; i++) {
        for (let j = i + 1; j < ids.length; j++) {
            if (seatsTouching(positions[ids[i]], positions[ids[j]])) {
                unite(ids[i], ids[j])
            }
        }
    }
    const buckets: { [root: string]: string[] } = {}
    ids.forEach((id) => {
        const root = find(id)
        if (!buckets[root]) buckets[root] = []
        buckets[root].push(id)
    })
    return Object.keys(buckets).map((root) => buckets[root])
}

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

export const mergePositions = (
    ids: string[],
    saved: Positions,
    roster: SeatIdentity[] = []
): Positions => {
    const result: Positions = {}
    Object.keys(saved).forEach((id) => {
        if (!isEmptySeatId(id)) return
        const point = saved[id]
        if (!point) return
        if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) return
        result[id] = copySeat(point)
    })

    const rosterById: { [id: string]: SeatIdentity } = {}
    roster.forEach((item) => {
        if (item && item.id) rosterById[item.id] = item
    })

    const takenSaved: { [id: string]: boolean } = {}
    ids.forEach((id) => {
        if (isEmptySeatId(id)) return
        const point = saved[id]
        if (!point || !Number.isFinite(point.x) || !Number.isFinite(point.y))
            return
        result[id] = copySeat(point, rosterById[id])
        takenSaved[id] = true
    })

    const nameToSaved: { [key: string]: string } = {}
    const nameCount: { [key: string]: number } = {}
    Object.keys(saved).forEach((savedId) => {
        if (isEmptySeatId(savedId) || takenSaved[savedId]) return
        const point = saved[savedId]
        if (!point || !Number.isFinite(point.x) || !Number.isFinite(point.y))
            return
        const key = seatPersonKey(point.name, point.surname)
        if (!key) return
        nameCount[key] = (nameCount[key] || 0) + 1
        nameToSaved[key] = savedId
    })
    Object.keys(nameCount).forEach((key) => {
        if (nameCount[key] !== 1) delete nameToSaved[key]
    })

    const missing: string[] = []
    ids.forEach((id) => {
        if (isEmptySeatId(id) || result[id]) return
        const student = rosterById[id]
        const key = student
            ? seatPersonKey(student.name, student.surname)
            : ''
        const savedId = key ? nameToSaved[key] : ''
        const point = savedId ? saved[savedId] : undefined
        if (savedId && point) {
            result[id] = copySeat(point, student)
            delete nameToSaved[key]
            takenSaved[savedId] = true
            return
        }
        missing.push(id)
    })

    if (missing.length === 0) {
        return result
    }
    if (Object.keys(result).length === 0) {
        const layout = defaultLayout(missing)
        missing.forEach((id) => {
            layout[id] = copySeat(layout[id], rosterById[id])
        })
        return layout
    }
    const box = boundingBox(result)
    const cols = layoutColumns(Math.max(missing.length, 1))
    const startY = box.y + box.h + CARD_GAP * 2
    const startX = LAYOUT_PAD
    missing.forEach((id, index) => {
        const col = index % cols
        const row = Math.floor(index / cols)
        result[id] = copySeat(
            {
                x: startX + col * (CARD_W + CARD_GAP),
                y: startY + row * (CARD_H + CARD_GAP),
            },
            rosterById[id]
        )
    })
    return result
}

export const shouldPersistMergedPlan = (
    saved: Positions,
    merged: Positions,
    studentIds: string[]
) => {
    if (studentIds.length === 0) return false
    const savedStudents = Object.keys(saved).filter((id) => !isEmptySeatId(id))
    if (savedStudents.length === 0) return true
    const matchedIds = studentIds.filter((id) => !!saved[id]).length
    if (matchedIds > 0) {
        const hadNew = studentIds.some((id) => !saved[id])
        const missingNames = studentIds.some((id) => {
            const point = saved[id]
            return !!(point && (!point.name || !point.surname))
        })
        return hadNew || missingNames
    }
    const fresh = defaultLayout(studentIds)
    const pick = (source: Positions) => {
        const next: Positions = {}
        studentIds.forEach((id) => {
            const point = source[id]
            if (!point) return
            next[id] = { x: point.x, y: point.y }
        })
        return next
    }
    return !samePositions(pick(merged), pick(fresh))
}

export const prunePositions = (ids: string[], positions: Positions): Positions => {
    const next: Positions = {}
    ids.forEach((id) => {
        const point = positions[id]
        if (!point) return
        if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) return
        next[id] = copySeat(roundPoint(point), {
            id,
            name: point.name,
            surname: point.surname,
        })
    })
    return next
}

export const samePositions = (a: Positions, b: Positions) => {
    const ids = Object.keys(a)
    if (ids.length !== Object.keys(b).length) return false
    return ids.every((id) => {
        const left = a[id]
        const right = b[id]
        return !!(
            left &&
            right &&
            left.x === right.x &&
            left.y === right.y
        )
    })
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

export const findFreeSeatPoint = (
    positions: Positions,
    preferred: Point
): Point => {
    const start = snapPosition('__empty__', preferred, positions)
    const blocked = (point: Point) =>
        Object.keys(positions).some((id) => seatsOverlap(point, positions[id]))
    if (!blocked(start)) return roundPoint(start)
    const stepX = CARD_W + CARD_GAP
    const stepY = CARD_H + CARD_GAP
    for (let ring = 1; ring <= 8; ring++) {
        for (let dx = -ring; dx <= ring; dx++) {
            for (let dy = -ring; dy <= ring; dy++) {
                if (Math.abs(dx) !== ring && Math.abs(dy) !== ring) continue
                const candidate = snapPosition(
                    '__empty__',
                    {
                        x: start.x + dx * stepX,
                        y: start.y + dy * stepY,
                    },
                    positions
                )
                if (!blocked(candidate)) return roundPoint(candidate)
            }
        }
    }
    const box = boundingBox(positions)
    return roundPoint({
        x: box.x,
        y: box.y + box.h + CARD_GAP * 2,
    })
}

export const addEmptySeat = (
    positions: Positions,
    preferred: Point
): Positions => {
    const id = nextEmptySeatId(positions)
    return {
        ...positions,
        [id]: findFreeSeatPoint(positions, preferred),
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

export const worldToScreen = (world: Point, view: ViewTransform): Point => ({
    x: world.x * view.scale + view.offset.x,
    y: world.y * view.scale + view.offset.y,
})

export const easeInOutCubic = (t: number) => {
    if (t <= 0) return 0
    if (t >= 1) return 1
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export const lerpView = (
    from: ViewTransform,
    to: ViewTransform,
    t: number
): ViewTransform => ({
    scale: from.scale + (to.scale - from.scale) * t,
    offset: {
        x: from.offset.x + (to.offset.x - from.offset.x) * t,
        y: from.offset.y + (to.offset.y - from.offset.y) * t,
    },
})

export const lerpScale = (from: number, to: number, t: number) => {
    if (from <= 0 || to <= 0) return from + (to - from) * t
    return Math.exp(Math.log(from) + (Math.log(to) - Math.log(from)) * t)
}

export const lerpViewTrackingWorld = (
    from: ViewTransform,
    to: ViewTransform,
    world: Point,
    t: number
): ViewTransform => {
    const scale = clampScale(lerpScale(from.scale, to.scale, t))
    const start = worldToScreen(world, from)
    const end = worldToScreen(world, to)
    const screen = {
        x: start.x + (end.x - start.x) * t,
        y: start.y + (end.y - start.y) * t,
    }
    return {
        scale,
        offset: {
            x: screen.x - world.x * scale,
            y: screen.y - world.y * scale,
        },
    }
}

export const viewCenteringWorld = (
    world: Point,
    scale: number,
    viewportW: number,
    viewportH: number
): ViewTransform => {
    const next = clampScale(scale)
    return {
        scale: next,
        offset: {
            x: viewportW / 2 - world.x * next,
            y: viewportH / 2 - world.y * next,
        },
    }
}

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
                    const seat: Point = { x: xy.x, y: xy.y }
                    if (typeof (xy as { name?: unknown }).name === 'string') {
                        const name = String((xy as { name: string }).name).trim()
                        if (name) seat.name = name
                    }
                    if (typeof (xy as { surname?: unknown }).surname === 'string') {
                        const surname = String(
                            (xy as { surname: string }).surname
                        ).trim()
                        if (surname) seat.surname = surname
                    }
                    positions[id] = seat
                }
            })
        }
        out[classe] = { locked: record.locked === true, positions }
    })
    return out
}
