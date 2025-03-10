import React from "react";
import { Link } from "react-router-dom";

export const LandingPage: React.FC = () => {

    return(
    <div>
        <h1>Pokédex</h1>
       <Link to="/pokemons">See Pokémon List</Link>
    </div>

    );

};