import React from "react";
import { Pokemon } from "../types/pokemonTypes";
import { Link } from "react-router-dom";
import '../styles/PokemonItem.scss'

interface PokemonItemProps {
  pokemon: Pokemon;
  index?: number;
}

const typeColors: Record<string, string> = {
  fire:     '#F08030',
  water:    '#6890F0',
  grass:    '#78C850',
  electric: '#F8D030',
  psychic:  '#F85888',
  ice:      '#98D8D8',
  dragon:   '#7038F8',
  dark:     '#705848',
  fairy:    '#EE99AC',
  normal:   '#A8A878',
  fighting: '#C03028',
  poison:   '#A040A0',
  ground:   '#E0C068',
  flying:   '#A890F0',
  bug:      '#A8B820',
  rock:     '#B8A038',
  ghost:    '#705898',
  steel:    '#B8B8D0',
};

export const PokemonItem: React.FC<PokemonItemProps> = ({ pokemon, index = 0 }) => {
    const animatedSprite =
  pokemon.sprites.versions["generation-v"]?.["black-white"]?.animated?.front_default
  || pokemon.sprites.versions["generation-viii"]?.animated?.front_default
  || pokemon.sprites.versions["generation-vi"]?.["x-y"]?.animated?.front_default
  || pokemon.sprites.versions["generation-vii"]?.["ultra-sun-ultra-moon"]?.animated?.front_default
  || pokemon.sprites.front_default
  || pokemon.sprites.other?.["official-artwork"]?.front_default;

  const primaryType = pokemon.types[0]?.type.name;
  const typeColor = typeColors[primaryType] ?? '#888';

  const nameFontSize = (name: string) => {
    const len = name.length;
    if (len <= 8)  return '1.2rem';
    if (len <= 10) return '1rem';
    if (len <= 12) return '0.85rem';
    return '0.7rem';
  };

    return(
<li key={pokemon.id} className="sprite-item" style={{ animationDelay: `${(index % 20) * 25}ms` }}>
   <Link className="sprite-link-full" to={`/pokemon/${pokemon.id}`}>
      <div
        className="sprite-container"
        style={{ '--type-color': typeColor } as React.CSSProperties}
      >
        <div className="sprite-name" style={{ fontSize: nameFontSize(pokemon.name) }}>{pokemon.name}</div>
        <div className="sprite-themselves">
          {animatedSprite ? (
            <img src={animatedSprite} alt={pokemon.name} />
          ) : (
            <p>No sprite available</p>
          )}
        </div>

        <div className="hover-card">
          <div className="hover-name">{pokemon.name}</div>
          <div className="hover-types">
            {pokemon.types.map(({ type }) => (
              <span
                key={type.name}
                className="type-badge"
                style={{ backgroundColor: typeColors[type.name] ?? '#888' }}
              >
                {type.name}
              </span>
            ))}
          </div>
          <div className="hover-abilities">
            <span className="hover-label">Abilities</span>
            <ul>
              {pokemon.abilities.map(({ ability, is_hidden }) => (
                <li key={ability.name}>
                  {ability.name}{is_hidden ? ' ✦' : ''}
                </li>
              ))}
            </ul>
          </div>
          <div className="hover-stats">
            <span>{pokemon.height / 10}m</span>
            <span>{pokemon.weight / 10}kg</span>
          </div>
        </div>
      </div>
    </Link>
  </li>
    );
};
