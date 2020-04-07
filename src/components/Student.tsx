import React, { useState } from 'react'
import alarm from '../images/behaviour.png'
import bookPile from '../images/homework.png'
import schoolBag from '../images/supply.png'
import pen from '../images/observation.png'
import openCard from '../images/openCard.png'
import closeCard from '../images/closeCard.png'
import moins from '../images/moins.png'
import plus from '../images/plus.png'

interface StudentProps {
    name: string
    surname: string
    avatar: string
    classe: string
}

export default (props: StudentProps) => {
    const [behaviour, setBehaviour] = useState(0)
    const [homework, setHomework] = useState(0)
    const [supply, setSupply] = useState(0)
    const [observation, setObservation] = useState(0)
    const [highlight, setHighlight] = useState(false)
    const [visible, setVisible] = useState(false)

    return (
        <div className="flex flex-col bg-gray-200 rounded my-2 pb-1 w-full h-screen">
            <div className="flex justify-between w-full">
                <div className="flex flex-col">
                    <button
                        onClick={() => {
                            setHighlight(!highlight)
                        }}
                        className={`flex flex-col lg:flex-row xl:flex:row mt-2 `}
                    >
                        <div
                            className={`font-studentName ml-2 text-3xl md:text-3xl lg:text-4xl xl:text-5xl text-gray-900 font-medium h-5 ${
                                highlight ? 'text-red-600' : ''
                            }`}
                        >
                            {props.name}
                        </div>
                        <div
                            className={`font-studentName ml-2 text-3xl md:text-3xl lg:text-4xl xl:text-5xl lg:ml-4 mt-2 md:mt-4 lg:mt-0 xl:mt-0 xl:ml-4 text-2xl text-gray-900 font-medium font-bold overflow-hidden ${
                                highlight ? 'text-red-600' : ''
                            }`}
                        >
                            {props.surname}
                        </div>
                    </button>
                    <div className="text-xs text-gray-600 flex flex-row ml-2 md:mt-2 md:mb-2">
                        <div className="flex flex-row align-baseline">
                            <img
                                className="mt-2 w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 md:ml-1 lg:ml-2 xl:ml-4"
                                src={alarm}
                                alt=""
                            />{' '}
                            <div className="font-bold text-black h-4 w-4 flex text-2xl md:text-3xl lg:text-4xl xl:text-5xl ">
                                {behaviour}
                            </div>
                        </div>{' '}
                        <div className="flex flex-row align-baseline">
                            <img
                                className="mt-2 w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 md:ml-1 lg:ml-2 xl:ml-4"
                                src={bookPile}
                                alt=""
                            />{' '}
                            <div className="font-bold text-black h-4 w-4 flex text-2xl md:text-3xl lg:text-4xl xl:text-5xl ">
                                {homework}
                            </div>
                        </div>{' '}
                        <div className="flex flex-row align-baseline">
                            <img
                                className="mt-2 w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 md:ml-1 lg:ml-2 xl:ml-4"
                                src={schoolBag}
                                alt=""
                            />{' '}
                            <div className="font-bold text-black h-4 w-4 flex text-2xl md:text-3xl lg:text-4xl xl:text-5xl ">
                                {supply}
                            </div>
                        </div>{' '}
                        <div className="flex flex-row align-baseline">
                            <img
                                className="mt-2 w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 md:ml-1 lg:ml-2 xl:ml-4"
                                src={pen}
                                alt=""
                            />{' '}
                            <div className="font-bold text-black h-4 w-4 flex text-2xl md:text-3xl lg:text-4xl xl:text-5xl ">
                                {observation}
                            </div>
                        </div>{' '}
                    </div>
                </div>
                <div className=" w-32 h-32 lg:w-1/2 xl:w-1/2 md:w-2/5 flex justify-around items-center content-around flex-wrap p-2 xl:mt-3">
                    <button
                        onClick={() => setBehaviour(behaviour + 1)}
                        className="bg-red-600 hover:opacity-50 flex p-2 text-white rounded-full w-12 h-12 xl:w-32 xl:h-32 lg:h-24 lg:w-24 md:h-20 md:w-20"
                    >
                        <img
                            className="md:w-16 md:h-16 md:p-1 lg:w-16 lg:h-16 lg:mx-2 xl:w-20 xl:h-20 xl:mx-4"
                            src={alarm}
                            alt=""
                        />
                    </button>
                    <button
                        onClick={() => setHomework(homework + 1)}
                        className="bg-blue-600 hover:opacity-50 p-2 text-white rounded-full w-12 h-12 xl:w-32 xl:h-32 lg:h-24 lg:w-24 md:h-20 md:w-20"
                    >
                        <img
                            className="md:w-16 md:h-16 md:p-1 lg:w-16 lg:h-16 lg:mx-2 xl:w-20 xl:h-20 xl:mx-4"
                            src={bookPile}
                            alt=""
                        />
                    </button>
                    <button
                        onClick={() => setSupply(supply + 1)}
                        className="bg-green-600 hover:opacity-50 p-2 text-white rounded-full w-12 h-12 xl:w-32 xl:h-32 lg:h-24 lg:w-24 md:h-20 md:w-20"
                    >
                        {' '}
                        <img
                            className="md:w-16 md:h-16 md:p-1 lg:w-16 lg:h-16 lg:mx-2 xl:w-20 xl:h-20 xl:mx-4"
                            src={schoolBag}
                            alt=""
                        />
                    </button>
                    <button
                        onClick={() => setObservation(observation + 1)}
                        className="bg-orange-500 hover:opacity-50 p-2 text-white rounded-full w-12 h-12 xl:w-32 xl:h-32 lg:h-24 lg:w-24 md:h-20 md:w-20"
                    >
                        <img
                            className="md:w-16 md:h-16 md:p-1 lg:w-16 lg:h-16 lg:mx-2 xl:w-20 xl:h-20 xl:mx-4"
                            src={pen}
                            alt=""
                        />
                    </button>
                </div>
            </div>
            {/* Dépliage de carte */}
            <div
                onMouseOut={() => setVisible(false)}
                className={`flex flex-row justify-between w-full ${
                    visible ? 'mt-4' : 'invisible h-0'
                } `}
            >
                <div className="flex flex-col">
                    <div className="flex flex-row">
                        <button
                            className="mx-2 w-12 h-12 flex self-center"
                            onClick={() => setBehaviour(behaviour - 1)}
                        >
                            <img src={moins} alt="" />
                        </button>
                        <img className="w-20 h-20" src={alarm} alt="" />
                        <button
                            className="mx-2 w-12 h-12 flex self-center"
                            onClick={() => setBehaviour(behaviour + 1)}
                        >
                            <img src={plus} alt="" />
                        </button>
                    </div>
                    <div className="flex justify-center">date</div>
                </div>
                <div className="flex flex-col">
                    <div className="flex flex-row">
                        <button
                            className="mx-2 w-12 h-12 flex self-center"
                            onClick={() => setHomework(homework - 1)}
                        >
                            <img src={moins} alt="" />
                        </button>
                        <img className="w-20 h-20" src={bookPile} alt="" />
                        <button
                            className="mx-2 w-12 h-12 flex self-center"
                            onClick={() => setHomework(homework + 1)}
                        >
                            <img src={plus} alt="" />
                        </button>
                    </div>
                    <div className="flex justify-center">date</div>
                </div>
                <div className="flex flex-col">
                    <div className="flex flex-row">
                        <button
                            className="mx-2 w-12 h-12 flex self-center"
                            onClick={() => setSupply(supply - 1)}
                        >
                            <img src={moins} alt="" />{' '}
                        </button>
                        <img className="w-20 h-20" src={schoolBag} alt="" />
                        <button
                            className="mx-2 w-12 h-12 flex self-center"
                            onClick={() => setSupply(supply + 1)}
                        >
                            <img src={plus} alt="" />
                        </button>
                    </div>
                    <div className="flex justify-center">date</div>
                </div>
                <div className="flex flex-col">
                    <div className="flex flex-row">
                        <button
                            className="mx-2 w-12 h-12 flex self-center"
                            onClick={() => setObservation(observation - 1)}
                        >
                            <img src={moins} alt="" />
                        </button>
                        <img className="w-20 h-20" src={pen} alt="" />
                        <button
                            className="mx-2 w-12 h-12 flex self-center"
                            onClick={() => setObservation(observation + 1)}
                        >
                            <img src={plus} alt="" />
                        </button>
                    </div>
                    <div className="flex justify-center">date</div>
                </div>
            </div>
            <div className="flex justify-center">
                <button onClick={() => setVisible(!visible)}>
                    <img
                        className="w-8 h-4 bg-gray-200"
                        src={visible ? closeCard : openCard}
                        alt=""
                    />
                </button>
            </div>
        </div>
    )
}
