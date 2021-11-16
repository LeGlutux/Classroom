import React, { useState, useContext, useRef, useEffect } from 'react'
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
    const [initialIcons, setInitialIcons] = useState(userIcons)

    const iconsVisualInitialState = (iconsList: number[]) => {
        const initialState = [] as string[]
        [0, 1, 2, 3, 4, 5].forEach((i) =>
            initialState.push(handleIcon(iconsList[i]))
        )
        return initialState
    }

    const [iconsDisplay, setIconsDisplay] = useState(['none'])

    useEffect(() => {
        setIcons(userIcons)
        setIconsDisplay(iconsVisualInitialState(icons))
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
        console.log(clickable, icons, initialIcons)

    }, [clicked, initialIcons, justSaved])

    return (
        <div className="flex flex-col h-full justify-around items-center"
        >
            <div className="flex flex-col h-full justify-around items-center">
                <div className="relative top-0 font-title text-3xl text-center">
                    Personnalisez vos cartes !
                </div>
                <div className='absolute z-50'>
                    Enregistré
                </div>
                <div
                    className={`flex flex-row w-full md:w-1/2 lg:w-1/2 xl:w-1/3 items-center`}
                >
                    <div
                        className={`rounded overflow-hidden ml-2 mt-5 pb-1 mx-2 bg-gray-100 w-full shadow-custom`}
                    >
                        <div className="flex justify-between flex-col">
                            <div className="flex flex-row">
                                <button className={`flex flex-row mt-2`}>
                                    <div
                                        className={`font-studentName ml-2 text-gray-900 font-medium h-5 text-2xl md:text-3xl lg:text-3x xl:text-4xl`}
                                    >
                                        {'Juan'}
                                    </div>
                                    <div
                                        className={`font-studentName ml-2 text-gray-900 font-bold text-2xl md:text-3xl lg:text-3x xl:text-4xl`}
                                    >
                                        {'Miguel'}
                                    </div>
                                </button>
                            </div>

                            <div
                                className={`w-full h-24 flex p-2 content-center justify-between pr-6 
                                `}
                            >
                                <div
                                    className={`flex flex-col ${icons[0] === 0 ? 'hidden' : 'visible'
                                        }`}
                                >
                                    <button
                                        onClick={() => handleChangeIcon(0, 1)}
                                        className="flex flex-row justify-center mb-1"
                                    >
                                        <img
                                            className="h-5 w-5"
                                            src={up}
                                            alt=""
                                        />
                                    </button>
                                    <div className="w-8 h-8 lg:w-12 lg:h-12 xl:w-12 xl:h-12 rounded-full">
                                        <img
                                            className=""
                                            src={
                                                clicked
                                                    ? iconsDisplay[0]
                                                    : iconsDisplay[0]
                                            }
                                            alt=""
                                        />
                                    </div>
                                    <button
                                        onClick={() => handleChangeIcon(0, -1)}
                                        className="flex flex-row justify-center mt-2"
                                    >
                                        <img
                                            className="h-5 w-5"
                                            src={down}
                                            alt=""
                                        />
                                    </button>
                                </div>

                                <div
                                    className={`flex flex-col ${icons[1] === 0 ? 'hidden' : 'visible'
                                        }`}
                                >
                                    <button
                                        onClick={() => handleChangeIcon(1, 1)}
                                        className="flex flex-row justify-center mb-1"
                                    >
                                        <img
                                            className="h-5 w-5"
                                            src={up}
                                            alt=""
                                        />
                                    </button>
                                    <div className="w-8 h-8 lg:w-12 lg:h-12 xl:w-12 xl:h-12 rounded-full">
                                        <img
                                            className=""
                                            src={
                                                clicked
                                                    ? iconsDisplay[1]
                                                    : iconsDisplay[1]
                                            }
                                            alt=""
                                        />
                                    </div>
                                    <button
                                        onClick={() => handleChangeIcon(1, -1)}
                                        className="flex flex-row justify-center mt-2"
                                    >
                                        <img
                                            className="h-5 w-5"
                                            src={down}
                                            alt=""
                                        />
                                    </button>
                                </div>
                                <div
                                    className={`flex flex-col ${icons[2] === 0 ? 'hidden' : 'visible'
                                        }`}
                                >
                                    <button
                                        onClick={() => handleChangeIcon(2, 1)}
                                        className="flex flex-row justify-center mb-1"
                                    >
                                        <img
                                            className="h-5 w-5"
                                            src={up}
                                            alt=""
                                        />
                                    </button>
                                    <div className="w-8 h-8 lg:w-12 lg:h-12 xl:w-12 xl:h-12 rounded-full">
                                        <img
                                            className=""
                                            src={
                                                clicked
                                                    ? iconsDisplay[2]
                                                    : iconsDisplay[2]
                                            }
                                            alt=""
                                        />
                                    </div>
                                    <button
                                        onClick={() => handleChangeIcon(2, -1)}
                                        className="flex flex-row justify-center mt-2"
                                    >
                                        <img
                                            className="h-5 w-5"
                                            src={down}
                                            alt=""
                                        />
                                    </button>
                                </div>
                                <div
                                    className={`flex flex-col ${icons[3] === 0 ? 'hidden' : 'visible'
                                        }`}
                                >
                                    <button
                                        onClick={() => handleChangeIcon(3, 1)}
                                        className="flex flex-row justify-center mb-1"
                                    >
                                        <img
                                            className="h-5 w-5"
                                            src={up}
                                            alt=""
                                        />
                                    </button>
                                    <div className="w-8 h-8 lg:w-12 lg:h-12 xl:w-12 xl:h-12 rounded-full">
                                        <img
                                            className=""
                                            src={
                                                clicked
                                                    ? iconsDisplay[3]
                                                    : iconsDisplay[3]
                                            }
                                            alt=""
                                        />
                                    </div>
                                    <button
                                        onClick={() => handleChangeIcon(3, -1)}
                                        className="flex flex-row justify-center mt-2"
                                    >
                                        <img
                                            className="h-5 w-5"
                                            src={down}
                                            alt=""
                                        />
                                    </button>
                                </div>
                                <div
                                    className={`flex flex-col ${icons[4] === 0 ? 'hidden' : 'visible'
                                        }`}
                                >
                                    <button
                                        onClick={() => handleChangeIcon(4, 1)}
                                        className="flex flex-row justify-center mb-1"
                                    >
                                        <img
                                            className="h-5 w-5"
                                            src={up}
                                            alt=""
                                        />
                                    </button>
                                    <div className="w-8 h-8 lg:w-12 lg:h-12 xl:w-12 xl:h-12 rounded-full">
                                        <img
                                            className=""
                                            src={
                                                clicked
                                                    ? iconsDisplay[4]
                                                    : iconsDisplay[4]
                                            }
                                            alt=""
                                        />
                                    </div>
                                    <button
                                        onClick={() => handleChangeIcon(4, -1)}
                                        className="flex flex-row justify-center mt-2"
                                    >
                                        <img
                                            className="h-5 w-5"
                                            src={down}
                                            alt=""
                                        />
                                    </button>
                                </div>
                                <div
                                    className={`flex flex-col ${icons[5] === 0 ? 'hidden' : 'visible'
                                        }`}
                                >
                                    <button
                                        onClick={() => handleChangeIcon(5, 1)}
                                        className="flex flex-row justify-center mb-1"
                                    >
                                        <img
                                            className="h-5 w-5"
                                            src={up}
                                            alt=""
                                        />
                                    </button>
                                    <div className="w-8 h-8 lg:w-12 lg:h-12 xl:w-12 xl:h-12 rounded-full">
                                        <img
                                            className=""
                                            src={
                                                clicked
                                                    ? iconsDisplay[5]
                                                    : iconsDisplay[5]
                                            }
                                            alt=""
                                        />
                                    </div>
                                    <button
                                        onClick={() => handleChangeIcon(5, -1)}
                                        className="flex flex-row justify-center mt-2"
                                    >
                                        <img
                                            className="h-5 w-5"
                                            src={down}
                                            alt=""
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>{' '}
                <div className="flex flex-row h-8 w-32 justify-around mt-3">
                    <button
                        className={`${icons.indexOf(0) === 1 ? 'invisible' : 'visible'
                            }`}
                        onClick={() => handleChangeIconsNumber(-1)}
                    >
                        <img className="h-8 w-8" src={delete_cross} alt="" />
                    </button>
                    <button
                        className={`${icons.indexOf(0) === -1 ? 'invisible' : 'visible'
                            }`}
                        onClick={() => handleChangeIconsNumber(1)}
                    >
                        <img className="h-8 w-8" src={add} alt="" />
                    </button>
                </div>
                <div
                    className={`flex h-16 w-56 mt-8 self-center bg-gray-300 rounded text-gray-100 text-lg font-bold text-center justify-center pt-1 mb-5 flex-wrap ${clickable ? 'hidden' : 'visible'}`}
                >
                    Enregistrer les modifications
                </div>
                <button
                    className={`flex h-16 w-56 mt-8 self-center bg-orange-500 rounded text-white text-lg font-bold justify-center pt-1 mb-5 flex-wrap ${clickable ? 'visible' : 'hidden'}`}
                    onClick={() => handleSave()}
                >
                    Enregistrer les modifications
                </button>
            </div>
        </div>
    )
}
