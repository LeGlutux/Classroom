import React, { useState, ChangeEvent, Component, useEffect } from 'react'
import NavBar from './NavBar'
import Firebase from 'firebase/app'
import 'react-datepicker/dist/react-datepicker.css'
import Dater from './Dater'

export default () => {
    const [checkTrimestre, setCheckTrimestre] = useState(true)
    const [checkDisplayTrimestre, setCheckDisplayTrimestre] = useState(false)
    const [checkDisplayGroups, setCheckDisplayGroups] = useState(true)
    const periodesTrimestre = ['T1', 'T2', 'T3']
    const periodesPeriodes = ['P1', 'P2', 'P3', 'P4', 'P5']
    return (
        <div className="w-full h-screen flex flex-col">
            <NavBar />
            <div className="flex flex-col mt-2 overflow-y-scroll">
                <div className="ml-4 flex flex-col">
                    <div className="font-bold text-orange-500 my-4">
                        CONFIGURER LES PÉRIODES
                    </div>
                    <div className="flex flex-row items-center ">
                        <input
                            type="checkbox"
                            className={`ml-8 mr-2 h-4 w-4`}
                            checked={checkTrimestre}
                            onChange={(e) => {
                                setCheckTrimestre(!checkTrimestre)
                            }}
                        />
                        <div>Trimestre</div>
                        <input
                            type="checkbox"
                            className={`ml-8 mr-2 h-4 w-4`}
                            checked={!checkTrimestre}
                            onChange={(e) => setCheckTrimestre(!checkTrimestre)}
                        />
                        <div>Périodes</div>
                    </div>
                    <form action="">
                        <div className="flex flex-col">
                            {checkTrimestre
                                ? periodesTrimestre.map((periode, index) => (
                                      <Dater key={index} title={periode} />
                                  ))
                                : periodesPeriodes.map((periode, index) => (
                                      <Dater key={index + 3} title={periode} />
                                  ))}
                        </div>
                    </form>
                    <div className="font-bold text-orange-500 mt-12 mb-4">
                        CONFIGURER L'AFFICHAGE
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="flex flex-row items-center">
                            <input
                                type="checkbox"
                                className={`ml-8 mr-2 h-4 w-4`}
                                checked={checkDisplayTrimestre}
                                onChange={(e) =>
                                    setCheckDisplayTrimestre(
                                        !checkDisplayTrimestre
                                    )
                                }
                            />
                            <div>Afficher les périodes</div>
                        </div>
                        <div className="flex flex-row items-center">
                            <input
                                type="checkbox"
                                className={`ml-8 mr-2 h-4 w-4`}
                                checked={checkDisplayGroups}
                                onChange={(e) =>
                                    setCheckDisplayGroups(!checkDisplayGroups)
                                }
                            />
                            <div>Afficher les groupes</div>
                        </div>
                    </div>
                    <div>
                        <button onClick={() => console.log(new Date())}>
                            {' '}
                            test{' '}
                        </button>
                        <button
                            className="bg-red-300"
                            onClick={() => Firebase.auth().signOut()}
                        >
                            Se déconnecter
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
