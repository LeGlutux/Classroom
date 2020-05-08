import React from 'react'
import { Link } from 'react-router-dom'
import nut from '../images/nut.png'
import addPage from '../images/addPage.png'
import bandeauCrayon2 from '../images/bandeauCrayon2.jpg'
export default () => {
    return (
        <div
            className="flex flex-row px-4 h-28"
            style={{ backgroundImage: `url(${bandeauCrayon2})` }}
        >
            <div className={`flex flex-row w-2/3  `}>
                <Link to="/">
                    <div className="flex flex-col align-text-top">
                        <div className="h-8 text-5xl font-title">Thòt</div>
                        <div className="ml-6 h-6 text-5xl font-title">Note</div>
                    </div>
                </Link>
            </div>
            <div className="w-1/2 flex items-center justify-end">
                <div
                    style={{ backgroundColor: 'rgba(255,255,255,0.6)' }}
                    className="rounded-full h-16 w-16 flex justify-center items-center"
                >
                    <Link to="/create">
                        <img
                            className="w-12 h-12 opacity-100"
                            src={addPage}
                            alt=""
                        />
                    </Link>
                </div>
                <Link to="/salut">test</Link>
            </div>
        </div>
    )
}
