import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { PokemonContext } from "../context/PokemonContext";

export const PokemonDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { state, fetchPokemonDetails } = useContext(PokemonContext);

  useEffect(() => {
    if (id) fetchPokemonDetails(id);
  }, [id, fetchPokemonDetails]);

  const pokemon = state.selectedPokemon;

  if (!pokemon) return <div>Loading...</div>;

  return (
    <div className="pokemon-detail">
      <h1>{pokemon.name.toUpperCase()}</h1>
      <img src={pokemon.sprites.front_default} alt={pokemon.name} />
      <p><strong>ID:</strong> {pokemon.id}</p>
      <p><strong>Height:</strong> {pokemon.height}</p>
      <p><strong>Weight:</strong> {pokemon.weight}</p>
      <p><strong>Types:</strong> {pokemon.types.map(t => t.type.name).join(", ")}</p>
      <p><strong>Description:</strong> {pokemon.description}</p>

      <h2>Stats</h2>
      <ul>
        {pokemon.stats.map(stat => (
          <li key={stat.stat.name}>
            {stat.stat.name}: {stat.base_stat}
          </li>
        ))}
      </ul>
    </div>
  );
};
