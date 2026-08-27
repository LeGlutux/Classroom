import React, { useEffect, useState } from 'react'
import firebase from 'firebase/app'
import up from '../../images/up.png'
import down from '../../images/down.png'
import {
    MAX_CROSS_ICONS,
    activeIconCount,
    handleIcon,
    maxValue,
    padIconList,
    DEFAULT_NEGATIVE_ICONS,
    DEFAULT_POSITIVE_ICONS,
} from '../../functions'
import { useIcons } from '../../hooks'
import { IconMinus, IconPlus } from '../Icons'

interface CardCustomerProps {
    userId: string
    setSaveConfirm: React.Dispatch<React.SetStateAction<boolean>>
}

const sameIcons = (a: number[], b: number[]) =>
    a.length === b.length && a.every((n, i) => n === b[i])

const CrossPreview = ({
    title,
    icons,
    siblingCount,
    onChangeCount,
    onChangeIcon,
}: {
    title: string
    icons: number[]
    siblingCount: number
    onChangeCount: (change: number) => void
    onChangeIcon: (index: number, change: number) => void
}) => {
    const count = activeIconCount(icons)
    const total = count + siblingCount
    const canRemove = count > 0
    const canAdd = count < MAX_CROSS_ICONS && total < MAX_CROSS_ICONS

    return (
        <div className="cross-customize-block">
            <div className="settings-group-label">{title}</div>
            <div className="student-card cross-customize-card">
                <div className="flex justify-between flex-col">
                    <div className="flex flex-row">
                        <div className="font-studentName ml-2 mt-2 text-gray-900 font-medium text-xl leading-none">
                            Alex
                        </div>
                        <div className="font-studentName ml-2 mt-2 text-gray-900 font-bold text-xl leading-none">
                            Daxe
                        </div>
                    </div>
                    <div className="w-full h-24 flex p-2 content-center justify-between pr-6">
                        {icons.map((icon, index) => (
                            <div
                                key={index}
                                className={`flex flex-col ${
                                    icon === 0 ? 'hidden' : 'visible'
                                }`}
                            >
                                <button
                                    type="button"
                                    onClick={() => onChangeIcon(index, 1)}
                                    className="flex flex-row justify-center mb-1"
                                >
                                    <img className="h-5 w-5" src={up} alt="" />
                                </button>
                                <div className="w-8 h-8 rounded-full">
                                    <img src={handleIcon(icon)} alt="" />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => onChangeIcon(index, -1)}
                                    className="flex flex-row justify-center mt-2"
                                >
                                    <img
                                        className="h-5 w-5"
                                        src={down}
                                        alt=""
                                    />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex flex-row h-8 w-32 justify-around mt-3 items-center mx-auto">
                <button
                    type="button"
                    className={`icon-step ${canRemove ? '' : 'invisible'}`}
                    onClick={() => onChangeCount(-1)}
                    aria-label="Retirer une icône"
                >
                    <IconMinus />
                </button>
                <button
                    type="button"
                    className={`icon-step ${canAdd ? '' : 'invisible'}`}
                    onClick={() => onChangeCount(1)}
                    aria-label="Ajouter une icône"
                >
                    <IconPlus />
                </button>
            </div>
        </div>
    )
}

export default (props: CardCustomerProps) => {
    const { icons: userIcons, positiveIcons: userPositiveIcons, loading } =
        useIcons(props.userId)
    const [icons, setIcons] = useState(userIcons)
    const [positiveIcons, setPositiveIcons] = useState(userPositiveIcons)
    const [initialIcons, setInitialIcons] = useState(userIcons)
    const [initialPositiveIcons, setInitialPositiveIcons] =
        useState(userPositiveIcons)
    const [justSaved, setJustSaved] = useState(false)
    const db = firebase.firestore()

    useEffect(() => {
        const nextIcons = padIconList(userIcons, DEFAULT_NEGATIVE_ICONS)
        const nextPositive = padIconList(
            userPositiveIcons,
            DEFAULT_POSITIVE_ICONS
        )
        setIcons(nextIcons)
        setPositiveIcons(nextPositive)
        setInitialIcons(nextIcons)
        setInitialPositiveIcons(nextPositive)
        setJustSaved(false)
    }, [userIcons, userPositiveIcons, loading])

    const loop = (initial: number, change: number) => {
        if (change === 1) return initial === maxValue ? 1 : initial + 1
        if (change === -1) return initial === 1 ? maxValue : initial - 1
        return initial
    }

    const handleChangeCount = (
        current: number[],
        setCurrent: React.Dispatch<React.SetStateAction<number[]>>,
        change: number,
        siblingCount: number
    ) => {
        const nextIndex = current.findIndex((n) => n === 0)
        if (change === 1) {
            if (nextIndex === -1) return
            if (activeIconCount(current) + siblingCount >= MAX_CROSS_ICONS)
                return
            const newElement = Math.floor(1 + Math.random() * maxValue)
            const next = current.slice()
            next[nextIndex] = newElement
            setCurrent(next)
            setJustSaved(false)
            return
        }
        if (change === -1) {
            if (nextIndex === 0) return
            const removeAt = nextIndex === -1 ? 5 : nextIndex - 1
            const next = current.slice()
            next[removeAt] = 0
            setCurrent(next)
            setJustSaved(false)
        }
    }

    const handleChangeIcon = (
        current: number[],
        setCurrent: React.Dispatch<React.SetStateAction<number[]>>,
        index: number,
        change: number
    ) => {
        if (current[index] === 0) return
        const next = current.slice()
        next[index] = loop(next[index], change)
        setCurrent(next)
        setJustSaved(false)
    }

    const handleSave = () => {
        db.collection('users').doc(props.userId).update({
            icons,
            positiveIcons,
        })
        setInitialIcons(icons)
        setInitialPositiveIcons(positiveIcons)
        setJustSaved(true)
        props.setSaveConfirm(true)
    }

    const clickable =
        !justSaved &&
        (!sameIcons(icons, initialIcons) ||
            !sameIcons(positiveIcons, initialPositiveIcons))

    return (
        <div className="flex flex-col items-center">
            <p className="settings-panel-note">
                Jusqu’à 6 icônes au total, réparties entre croix négatives et
                croix positives.
            </p>
            <CrossPreview
                title="Croix négatives"
                icons={icons}
                siblingCount={activeIconCount(positiveIcons)}
                onChangeCount={(change) =>
                    handleChangeCount(
                        icons,
                        setIcons,
                        change,
                        activeIconCount(positiveIcons)
                    )
                }
                onChangeIcon={(index, change) =>
                    handleChangeIcon(icons, setIcons, index, change)
                }
            />
            <CrossPreview
                title="Croix positives"
                icons={positiveIcons}
                siblingCount={activeIconCount(icons)}
                onChangeCount={(change) =>
                    handleChangeCount(
                        positiveIcons,
                        setPositiveIcons,
                        change,
                        activeIconCount(icons)
                    )
                }
                onChangeIcon={(index, change) =>
                    handleChangeIcon(
                        positiveIcons,
                        setPositiveIcons,
                        index,
                        change
                    )
                }
            />
            <div
                className={`settings-btn is-disabled ${
                    clickable ? 'hidden' : ''
                }`}
            >
                Enregistrer les modifications
            </div>
            <button
                type="button"
                className={`settings-btn ${clickable ? '' : 'hidden'}`}
                onClick={handleSave}
            >
                Enregistrer les modifications
            </button>
        </div>
    )
}
