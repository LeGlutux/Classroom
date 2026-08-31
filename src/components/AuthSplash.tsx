import React from 'react'
import Loader from './Loader'

export default () => (
    <div className="w-full h-screen flex flex-col justify-center items-center app-bg">
        <div className="empty-title">Chargement des données</div>
        <Loader />
    </div>
)
