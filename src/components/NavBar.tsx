import React from 'react'
import { Link } from 'react-router-dom'
import addPage from '../images/addPage.png'
import list from '../images/list.png'
import home from '../images/home.png'
import { fetchRunningPeriode } from '../database'

interface Props {
    runningPeriode: number
}

export default (props: Props) => {
    return (
        <div className="flex flex-row bg-gray-300 border-5 border-orange-300 px-4 h-full justify-around py-2">
            <div className="absolute top-25 right-5 flex justify-center items-center justify-middle z-50 text-md font-studentName font-normal">{'P'.concat(props.runningPeriode.toString())}</div>
            <div className="rounded-full h-8 w-8 xl:h-10 xl:w-10 flex justify-center">
                <Link to="/create">
                    <img className="self-center" src={addPage} alt="" />
                </Link>
            </div>
            <div
                className={`rounded-full h-8 w-8 xl:h-10 xl:w-10 flex justify-center`}
            >
                <Link to="/">
                    <img className="self-center" src={home} alt="" />
                </Link>
            </div>
            <div className="rounded-full h-8 w-8 xl:h-10 xl:w-10 flex justify-center">
                <Link to="/lists">
                    <img className="self-center" src={list} alt="" />
                </Link>
            </div>
        </div>
    )
}
