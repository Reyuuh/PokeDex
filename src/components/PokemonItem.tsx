import React from "react";
import { Pokemon } from "../types/pokemonTypes";
import { Link } from "react-router-dom";
import '../styles/PokemonSprites.scss'

interface PokemonItemProps {
    pokemon: Pokemon;
}

export const PokemonItem: React.FC<PokemonItemProps> = ({ pokemon }) => {
    const animatedSprite =
  pokemon.sprites.versions["generation-v"]?.["black-white"]?.animated?.front_default
  || pokemon.sprites.versions["generation-viii"]?.animated?.front_default
  || pokemon.sprites.versions["generation-vi"]?.["x-y"]?.animated?.front_default
  || pokemon.sprites.versions["generation-vii"]?.["ultra-sun-ultra-moon"]?.animated?.front_default
  || pokemon.sprites.front_default;

    return(
<li key={pokemon.id} className="sprite-item">
   <Link className="sprite-link-full" to={`/pokemon/${pokemon.id}`}>
      <div className="sprite-container">
        <div className="sprite-name" >{pokemon.name}</div>
                 <div className="sprite-themselves" >
                  {animatedSprite ? (
                   <img src={animatedSprite} 
                   alt={pokemon.name} 
                   />
                  ):(
                    <p>No sprite available</p>
                  )}  
                </div>
             </div>
         </Link>   
      </li>
    );
};
