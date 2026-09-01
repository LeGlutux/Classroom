import {
    CARD_GAP,
    CARD_H,
    CARD_W,
    DOUBLE_TAP_MS,
    DOUBLE_TAP_PX,
    DOUBLE_TAP_ZOOM_STEPS,
    LAYOUT_PAD,
    MAX_SCALE,
    MIN_SCALE,
    ZOOM_STEP,
    applyDrop,
    addEmptySeat,
    emptySeatIds,
    isEmptySeatId,
    nextEmptySeatId,
    removeSeat,
    seatsOverlap,
    clampScale,
    defaultLayout,
    findSwapTarget,
    fitView,
    layoutColumns,
    mergePositions,
    parseStoredPlans,
    prunePositions,
    seatCaption,
    seatsTouching,
    linkedSeatGroups,
    snapPosition,
    splitGivenName,
    steppedZoomScale,
    swapSeats,
    viewCenteringWorld,
    worldToScreen,
    lerpView,
    lerpViewTrackingWorld,
    easeInOutCubic,
    isDoubleTap,
    zoomAround,
} from './seatingPlan'

describe('layoutColumns', () => {
    it('adapte le nombre de colonnes à l’effectif', () => {
        expect(layoutColumns(1)).toBe(1)
        expect(layoutColumns(3)).toBe(2)
        expect(layoutColumns(8)).toBe(3)
        expect(layoutColumns(15)).toBe(4)
        expect(layoutColumns(20)).toBe(5)
        expect(layoutColumns(30)).toBe(6)
    })
})

describe('defaultLayout', () => {
    it('place les élèves en grille à partir du padding', () => {
        const positions = defaultLayout(['a', 'b', 'c'])
        expect(positions.a).toEqual({ x: LAYOUT_PAD, y: LAYOUT_PAD })
        expect(positions.b).toEqual({
            x: LAYOUT_PAD + CARD_W + CARD_GAP,
            y: LAYOUT_PAD,
        })
        expect(positions.c).toEqual({
            x: LAYOUT_PAD,
            y: LAYOUT_PAD + CARD_H + CARD_GAP,
        })
    })
})

describe('mergePositions', () => {
    it('conserve les places déjà enregistrées', () => {
        const merged = mergePositions(
            ['a', 'b'],
            { a: { x: 10, y: 20 }, b: { x: 40, y: 50 } }
        )
        expect(merged).toEqual({
            a: { x: 10, y: 20 },
            b: { x: 40, y: 50 },
        })
    })

    it('ajoute les nouveaux élèves sous le plan existant', () => {
        const merged = mergePositions(['a', 'b'], { a: { x: 10, y: 20 } })
        expect(merged.a).toEqual({ x: 10, y: 20 })
        expect(merged.b.y).toBe(20 + CARD_H + CARD_GAP * 2)
    })

    it('génère une grille si rien n’est encore enregistré', () => {
        expect(mergePositions(['a', 'b'], {})).toEqual(defaultLayout(['a', 'b']))
    })

    it('conserve les cadres vides déjà enregistrés', () => {
        const merged = mergePositions(['a'], {
            a: { x: 10, y: 20 },
            'blank:2': { x: 80, y: 40 },
            junk: { x: 1, y: 2 },
        })
        expect(merged).toEqual({
            a: { x: 10, y: 20 },
            'blank:2': { x: 80, y: 40 },
        })
    })
})

describe('empty seats', () => {
    it('numérote les cadres vides', () => {
        expect(nextEmptySeatId({})).toBe('blank:1')
        expect(
            nextEmptySeatId({
                a: { x: 0, y: 0 },
                'blank:1': { x: 10, y: 10 },
                'blank:4': { x: 20, y: 20 },
            })
        ).toBe('blank:5')
        expect(isEmptySeatId('blank:1')).toBe(true)
        expect(isEmptySeatId('s1')).toBe(false)
    })

    it('place un cadre vide sans recouvrir un élève', () => {
        const positions = { a: { x: 0, y: 0 } }
        const next = addEmptySeat(positions, { x: 2, y: 1 })
        expect(emptySeatIds(next)).toEqual(['blank:1'])
        expect(seatsOverlap(next.a, next['blank:1'])).toBe(false)
    })

    it('échange un élève avec un cadre vide', () => {
        const origin = { x: 0, y: 0 }
        const blank = { x: CARD_W + CARD_GAP, y: 0 }
        const dropped = applyDrop(
            { a: origin, 'blank:1': blank },
            'a',
            blank,
            origin
        )
        expect(dropped.a).toEqual(blank)
        expect(dropped['blank:1']).toEqual(origin)
    })

    it('retire un cadre vide sans toucher aux autres', () => {
        expect(
            removeSeat(
                { a: { x: 1, y: 2 }, 'blank:1': { x: 3, y: 4 } },
                'blank:1'
            )
        ).toEqual({ a: { x: 1, y: 2 } })
    })
})

describe('prunePositions', () => {
    it('retire les places des élèves disparus et arrondit', () => {
        expect(
            prunePositions(['a'], {
                a: { x: 1.26, y: 4.84 },
                gone: { x: 0, y: 0 },
            })
        ).toEqual({ a: { x: 1.3, y: 4.8 } })
    })

    it('ignore les coordonnées non numériques', () => {
        expect(
            prunePositions(['a', 'b'], {
                a: { x: 2, y: 3 },
                b: { x: NaN, y: 1 },
            })
        ).toEqual({ a: { x: 2, y: 3 } })
    })
})

describe('snapPosition', () => {
    const others = {
        a: { x: 100, y: 80 },
        moving: { x: 0, y: 0 },
    }

    it('aligne un cadre sur un voisin proche', () => {
        expect(snapPosition('moving', { x: 108, y: 86 }, others)).toEqual({
            x: 100,
            y: 80,
        })
    })

    it('colle un cadre à droite d’un autre, bord à bord', () => {
        const beside = 100 + CARD_W + CARD_GAP
        expect(
            snapPosition('moving', { x: beside - 6, y: 80 }, others)
        ).toEqual({ x: beside, y: 80 })
        expect(beside).toBeLessThan(100 + CARD_W)
    })

    it('ne magnétise pas trop loin', () => {
        expect(snapPosition('moving', { x: 10, y: 0 }, others)).toEqual({
            x: 10,
            y: 0,
        })
    })
})

describe('findSwapTarget / swapSeats / applyDrop', () => {
    const origin = { x: 0, y: 0 }
    const positions = {
        held: { x: 0, y: 0 },
        other: { x: 200, y: 40 },
    }

    it('détecte un dépôt au-dessus d’un autre cadre', () => {
        expect(findSwapTarget('held', { x: 198, y: 42 }, positions)).toBe(
            'other'
        )
        expect(findSwapTarget('held', { x: 10, y: 10 }, positions)).toBe(null)
    })

    it('échange avec la place d’origine de celui qu’on tient', () => {
        expect(swapSeats(positions, 'held', 'other', origin)).toEqual({
            held: { x: 200, y: 40 },
            other: { x: 0, y: 0 },
        })
    })

    it('applique l’échange au drop, sinon garde la place aimantée', () => {
        expect(applyDrop(positions, 'held', { x: 202, y: 41 }, origin)).toEqual({
            held: { x: 200, y: 40 },
            other: { x: 0, y: 0 },
        })
        const parked = applyDrop(
            positions,
            'held',
            { x: 10, y: 200 },
            origin
        )
        expect(parked.held).toEqual({ x: 10, y: 200 })
        expect(parked.other).toEqual({ x: 200, y: 40 })
    })
})

describe('fitView / zoomAround / clampScale', () => {
    it('cadre le plan dans la fenêtre', () => {
        const view = fitView(
            { a: { x: 0, y: 0 }, b: { x: CARD_W + CARD_GAP, y: 0 } },
            400,
            300
        )
        expect(view.scale).toBeGreaterThan(0)
        expect(view.scale).toBeLessThanOrEqual(1.35)
    })

    it('zoome autour d’un point sans le déplacer', () => {
        const current = { scale: 1, offset: { x: 10, y: 20 } }
        const pivot = { x: 110, y: 120 }
        const next = zoomAround(current, 2, pivot)
        const worldBefore = {
            x: (pivot.x - current.offset.x) / current.scale,
            y: (pivot.y - current.offset.y) / current.scale,
        }
        const worldAfter = {
            x: (pivot.x - next.offset.x) / next.scale,
            y: (pivot.y - next.offset.y) / next.scale,
        }
        expect(worldAfter).toEqual(worldBefore)
        expect(next.scale).toBe(2)
    })

    it('borne le zoom', () => {
        expect(clampScale(0.01)).toBe(MIN_SCALE)
        expect(clampScale(99)).toBe(MAX_SCALE)
    })

    it('détecte un double-tap proche dans le temps et l’espace', () => {
        const first = { time: 1000, x: 40, y: 80 }
        expect(
            isDoubleTap(first, { time: 1000 + DOUBLE_TAP_MS, x: 40, y: 80 })
        ).toBe(true)
        expect(
            isDoubleTap(first, {
                time: 1000 + DOUBLE_TAP_MS + 1,
                x: 40,
                y: 80,
            })
        ).toBe(false)
        expect(
            isDoubleTap(first, { time: 1100, x: 40 + DOUBLE_TAP_PX, y: 80 })
        ).toBe(true)
        expect(
            isDoubleTap(first, { time: 1100, x: 40 + DOUBLE_TAP_PX + 1, y: 80 })
        ).toBe(false)
        expect(isDoubleTap(null, first)).toBe(false)
    })

    it('applique trois crans + comme les boutons', () => {
        expect(steppedZoomScale(1, DOUBLE_TAP_ZOOM_STEPS)).toBeCloseTo(
            ZOOM_STEP * ZOOM_STEP * ZOOM_STEP
        )
        expect(steppedZoomScale(1, -DOUBLE_TAP_ZOOM_STEPS)).toBeCloseTo(
            1 / (ZOOM_STEP * ZOOM_STEP * ZOOM_STEP)
        )
    })

    it('cadre un point monde au centre de la fenêtre', () => {
        const world = { x: 80, y: 40 }
        const view = viewCenteringWorld(world, 2, 400, 300)
        expect(worldToScreen(world, view)).toEqual({ x: 200, y: 150 })
    })

    it('interpole une vue d’un bout à l’autre', () => {
        const from = { scale: 1, offset: { x: 0, y: 0 } }
        const to = { scale: 2, offset: { x: 10, y: 20 } }
        expect(lerpView(from, to, 0)).toEqual(from)
        expect(lerpView(from, to, 1)).toEqual(to)
        expect(lerpView(from, to, 0.5)).toEqual({
            scale: 1.5,
            offset: { x: 5, y: 10 },
        })
        expect(easeInOutCubic(0)).toBe(0)
        expect(easeInOutCubic(1)).toBe(1)
        expect(easeInOutCubic(0.5)).toBe(0.5)
    })

    it('fait glisser un point monde vers sa place cible pendant le zoom', () => {
        const world = { x: 80, y: 40 }
        const from = { scale: 1, offset: { x: 10, y: 20 } }
        const to = viewCenteringWorld(world, 2, 400, 300)
        expect(lerpViewTrackingWorld(from, to, world, 0)).toEqual(from)
        const end = lerpViewTrackingWorld(from, to, world, 1)
        expect(end.scale).toBeCloseTo(to.scale)
        expect(worldToScreen(world, end)).toEqual({ x: 200, y: 150 })
        const mid = lerpViewTrackingWorld(from, to, world, 0.5)
        const startScreen = worldToScreen(world, from)
        const midScreen = worldToScreen(world, mid)
        expect(midScreen.x).toBeCloseTo((startScreen.x + 200) / 2)
        expect(midScreen.y).toBeCloseTo((startScreen.y + 150) / 2)
    })
})

describe('splitGivenName / seatCaption', () => {
    it('sépare un prénom composé sur deux lignes', () => {
        expect(splitGivenName('Jean-Pierre')).toEqual({
            head: 'Jean',
            tail: 'Pierre',
        })
        expect(splitGivenName('Marie Claire')).toEqual({
            head: 'Marie',
            tail: 'Claire',
        })
        expect(splitGivenName('Léa')).toEqual({ head: 'Léa', tail: '' })
    })

    it('coupe les prénoms trop longs pour le cadre', () => {
        const caption = seatCaption(
            { surname: 'Christophe', name: 'Dupont' },
            [{ surname: 'Christophe' }]
        )
        expect(caption.line1).toBe('Christo…')
        expect(caption.hint).toBe('')
    })

    it('ajoute les 3 lettres du nom si le prénom est partagé', () => {
        const mates = [{ surname: 'Léa' }, { surname: 'Léa' }]
        expect(
            seatCaption({ surname: 'Léa', name: 'Dupont' }, mates)
        ).toEqual({
            line1: 'Léa',
            line2: '',
            hint: 'Dup',
        })
        expect(
            seatCaption({ surname: 'Jean-Pierre', name: 'Martin' }, [
                { surname: 'Jean-Pierre' },
                { surname: 'Jean-Pierre' },
            ])
        ).toEqual({
            line1: 'Jean',
            line2: 'Pierre',
            hint: 'Mar',
        })
    })
})

describe('seatsTouching / linkedSeatGroups', () => {
    it('détecte deux cadres collés et un L', () => {
        const a = { x: 0, y: 0 }
        const b = { x: CARD_W + CARD_GAP, y: 0 }
        const c = { x: 0, y: CARD_H + CARD_GAP }
        const far = { x: 400, y: 400 }
        expect(seatsTouching(a, b)).toBe(true)
        expect(seatsTouching(a, c)).toBe(true)
        expect(seatsTouching(a, far)).toBe(false)
        const groups = linkedSeatGroups({
            a,
            b,
            c,
            d: far,
        })
        const sorted = groups
            .map((group) => group.slice().sort().join(','))
            .sort()
        expect(sorted).toEqual(['a,b,c', 'd'])
    })
})

describe('parseStoredPlans', () => {
    it('ignore les données invalides', () => {
        expect(parseStoredPlans(null)).toEqual({})
        expect(parseStoredPlans('nope')).toEqual({})
    })

    it('lit locked et les positions numériques', () => {
        expect(
            parseStoredPlans({
                '6A': {
                    locked: true,
                    positions: {
                        s1: { x: 8, y: 9 },
                        bad: { x: 'no' },
                    },
                },
            })
        ).toEqual({
            '6A': {
                locked: true,
                positions: { s1: { x: 8, y: 9 } },
            },
        })
    })
})
