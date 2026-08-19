import React, { useState, useEffect } from 'react'
import firebase from 'firebase/app'
import add from '../../images/add.png'
import delete_cross from '../../images/delete.png'
import up from '../../images/up.png'
import down from '../../images/down.png'
import { handleIcon, maxValue } from '../../functions'
import { useIcons } from '../../hooks'

interface CardCustomerProps {
    userId: string
    setSaveConfirm: React.Dispatch<React.SetStateAction<boolean>>
}

export default (props: CardCustomerProps) => {
    const userIcons = useIcons(props.userId).icons
    const loading = useIcons(props.userId).loading

    const [icons, setIcons] = useState(userIcons)
    const [clicked, setClicked] = useState(false)
    const [initialIcons] = useState(userIcons)

    const iconsVisualInitialState = (iconsList: number[]) => {
        const initialState = [] as string[]
        ;[0, 1, 2, 3, 4, 5].forEach((i) =>
            initialState.push(handleIcon(iconsList[i]))
        )
        return initialState
    }

    const [iconsDisplay, setIconsDisplay] = useState(['none'])

    useEffect(() => {
        setIcons(userIcons)
        setIconsDisplay(iconsVisualInitialState(userIcons))
    }, [userIcons, loading])

    const db = firebase.firestore()

    const handleChangeIconsNumber = (change: number) => {
        const nextIndex = icons.findIndex((n) => n === 0)
        if (change === 1 && nextIndex !== -1) {
            const newElement = Math.floor(1 + Math.random() * maxValue)
            const iconsF = icons
            iconsF.splice(nextIndex, 1, newElement)
            setIcons(iconsF)

            const iconsD = iconsDisplay
            iconsD.splice(nextIndex, 1, handleIcon(newElement))
            setIconsDisplay(iconsD)
        }
        if (change === -1 && nextIndex !== 1) {
            if (nextIndex === -1) {
                const iconsF = icons
                iconsF.splice(5, 1, 0)
                setIcons(iconsF)

                const iconsD = iconsDisplay
                iconsD.splice(5, 1, 'none')
                setIconsDisplay(iconsD)
            } else {
                const iconsF = icons
                iconsF.splice(nextIndex - 1, 1, 0)
                setIcons(iconsF)

                const iconsD = iconsDisplay
                iconsD.splice(nextIndex - 1, 1, 'none')
                setIconsDisplay(iconsD)
            }
        }
        setClicked(!clicked)
        setJustSaved(false)
    }

    const handleChangeIcon = (index: number, change: number) => {
        const loop = (initial: number) => {
            if (change === 1) return initial === maxValue ? 1 : initial + 1
            if (change === -1) return initial === 1 ? maxValue : initial - 1
            else return -1
        }
        if (change === 1) {
            const iconsF = icons
            iconsF.splice(index, 1, loop(iconsF[index]))
            setIcons(iconsF)

            const iconsD = iconsDisplay
            iconsD.splice(index, 1, handleIcon(iconsF[index]))
            setIconsDisplay(iconsD)
        }

        if (change === -1) {
            const iconsF = icons
            iconsF.splice(index, 1, loop(iconsF[index]))
            setIcons(iconsF)

            const iconsD = iconsDisplay
            iconsD.splice(index, 1, handleIcon(iconsF[index]))
            setIconsDisplay(iconsD)
        }
        setClicked(!clicked)
        setJustSaved(false)
    }

    const [justSaved, setJustSaved] = useState(false)
    const handleSave = () => {
        db.collection('users').doc(props.userId).update({
            icons,
        })
        setJustSaved(true)
        props.setSaveConfirm(true)
    }
    const [clickable, setClickable] = useState(false)

    useEffect(() => {
        if (icons !== initialIcons && justSaved === false) setClickable(true)
        else setClickable(false)
    }, [clicked, initialIcons, justSaved, icons])

    return (
        <div className="flex flex-col h-full justify-around items-center">
            <div className="settings-title">Personnalisez vos cartes</div>
            <div className="student-card w-full" style={{ margin: '0.4rem 0' }}>
                <div className="student-card-head">
                    <div className="student-card-names" style={{ cursor: 'default' }}>
                        <span className="student-surname">Alex</span>
                        <span className="student-name">Daxe</span>
                    </div>
                </div>
                <div className="cross-row is-stacked">
                    {[0, 1, 2, 3, 4, 5].map((index) =>
                        icons[index] === 0 ? null : (
                            <div className="icon-picker" key={index}>
                                <button
                                    type="button"
                                    className="icon-picker-nudge"
                                    onClick={() => handleChangeIcon(index, 1)}
                                    aria-label="Icône suivante"
                                >
                                    <img src={up} alt="" />
                                </button>
                                <div className="cross-stat" style={{ cursor: 'default' }}>
                                    <img src={iconsDisplay[index]} alt="" />
                                </div>
                                <button
                                    type="button"
                                    className="icon-picker-nudge"
                                    onClick={() => handleChangeIcon(index, -1)}
                                    aria-label="Icône précédente"
                                >
                                    <img src={down} alt="" />
                                </button>
                            </div>
                        )
                    )}
                </div>
            </div>
            <div className="flex flex-row h-8 w-32 justify-around mt-3">
                <button
                    type="button"
                    className={`${
                        icons.indexOf(0) === 1 ? 'invisible' : ''
                    }`}
                    onClick={() => handleChangeIconsNumber(-1)}
                    aria-label="Retirer une icône"
                >
                    <img className="h-8 w-8" src={delete_cross} alt="" />
                </button>
                <button
                    type="button"
                    className={`${
                        icons.indexOf(0) === -1 ? 'invisible' : ''
                    }`}
                    onClick={() => handleChangeIconsNumber(1)}
                    aria-label="Ajouter une icône"
                >
                    <img className="h-8 w-8" src={add} alt="" />
                </button>
            </div>
            <div
                className={`btn-disabled mt-8 ${
                    clickable ? 'hidden' : ''
                }`}
            >
                Enregistrer les modifications
            </div>
            <button
                type="button"
                className={`btn-primary mt-8 ${
                    clickable ? '' : 'hidden'
                }`}
                onClick={() => handleSave()}
            >
                Enregistrer les modifications
            </button>
        </div>
    )
}
