import React from "react";
import "./Home.css";
import { useSelector } from 'react-redux'
import Profile from "../Profile/Profile";

export default function Home() {
    
    const state = useSelector(state => state)

    if (state.isLogged) {
        
        return <Profile />
        
    } else {

        return (
            <div className="Home">
                <div className="lander">
                    <h1>Zaloguj się aby zobaczyć stronę domową.</h1>
                </div>
            </div>
        );

    }
    
}
