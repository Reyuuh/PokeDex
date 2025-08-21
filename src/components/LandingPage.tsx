import React from "react";
import { Link } from "react-router-dom";
import '../styles/LandingPage.scss';

export const LandingPage: React.FC = () => {
  return (
    <div className="landingpage-container">
      <h1 className="welcome slide-in-right">Welcome to the Pokédex!</h1>
      <Link className="pokedex-continue-link slide-in-left" to="/pokemons">Continue</Link>
    </div>
  );
};