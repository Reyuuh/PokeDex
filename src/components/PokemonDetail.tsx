import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { PokemonContext } from "../context/PokemonContext";
import '../styles/PokemonDetail.scss'
import { Link } from "react-router-dom";

export const PokemonDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { state, fetchPokemonDetails } = useContext(PokemonContext);

  useEffect(() => {
    if (id) fetchPokemonDetails(id);
  }, [id, fetchPokemonDetails]);

  const pokemon = state.selectedPokemon;

  if (!pokemon) return <div>Loading...</div>;

  return (


    

    <div className="pokemon-detail-container">
      <div className="back-link-container">
      <Link to="/pokemons" className="back-link">Back to List</Link>
      </div>
<div className="three-in-row">
<div className="pokemon-info-container">    
      <div className="attributes-container">
      <h2>ATTRIBUTES</h2>
      <p><strong>ID:</strong> {pokemon.id}</p>
      <p><strong>Height:</strong> {pokemon.height}</p>
      <p><strong>Weight:</strong> {pokemon.weight}</p>
      <p><strong>Types:</strong> {pokemon.types.map(t => t.type.name).join(", ")}</p>
      </div>

  <div className="the-middle">
      <h1>{pokemon.name.toUpperCase()}</h1>
      <img
    className="pokemon-sprite"
    src={pokemon.sprites.animated ?? pokemon.sprites.front_default}
    alt={pokemon.name}
/>
</div>

<div className="stats-container">
      <h2>STATS</h2>
      <ul>
        {pokemon.stats.map(stat => (
          <li key={stat.stat.name}>
            {stat.stat.name}: {stat.base_stat}
          </li>
        ))}
      </ul>
      </div>  
    </div>  
</div>
     <div className="
      pokemon-description-container">
      <strong className="description" >Description</strong>
      <p className="pokemon-description"> {pokemon.description}</p>
     </div> 

    
    
      
    </div>
  );
};
