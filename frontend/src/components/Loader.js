import React from 'react'
import img from '../assets/loader.gif'

export default function Loader() {
    return (
        <div className="text-center">
            <h1>Ładowanie...</h1>
            <img src={img} alt="Ładowanie..." />
        </div>
    )
}
