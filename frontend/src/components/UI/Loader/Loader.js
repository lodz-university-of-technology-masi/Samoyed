import React from 'react'
import img from '../../../assets/loading.gif'

export default function Loader(props) {
    return (
        <div className="text-center">
            <img src={img} alt="Ładowanie..." 
                 width={ props.size ? props.size : "128px" } 
                 style={{margin: 10}} />
            { props.children }
        </div>
    )
}
