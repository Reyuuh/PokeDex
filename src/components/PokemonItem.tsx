import React from "react";
import { Pokemon } from "../types/pokemonTypes";
import { Link } from "react-router-dom";

interface PokemonItemProps {
    pokemon: Pokemon;
}

export const PokemonItem: React.FC<PokemonItemProps> = ({ pokemon }) => {
    return (
      <li key={pokemon.id}>
        <Link to={`/pokemon/${pokemon.id}`}>{pokemon.name}</Link>
        <div>
          {pokemon.sprites?.front_default ? (
            <img
              src={pokemon.sprites.versions["generation-v"]["black-white"].animated.front_default}
              alt={pokemon.name}
              width={80}
              height={80}
            />
          ) : (
            <p>No sprite available</p>
          )}
        </div>
      </li>
    );
  };