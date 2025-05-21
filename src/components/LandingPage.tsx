import React from "react";
import { Link } from "react-router-dom";
import '../styles/LandingPage.scss'

export const LandingPage: React.FC = () => {

    return(
    <div className="landingpage-container" >
        <h1 className="welcome" >Welcome to my Pokédex</h1>
       <Link className="pokedex-link" to="/pokemons">Continue</Link>
    </div>

    );

};