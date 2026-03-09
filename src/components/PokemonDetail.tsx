import React, { useContext, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { PokemonContext } from "../context/PokemonContext";
import '../styles/PokemonDetail.scss'

const typeColors: Record<string, string> = {
  fire:     '#F08030', water:    '#6890F0', grass:    '#78C850',
  electric: '#F8D030', psychic:  '#F85888', ice:      '#98D8D8',
  dragon:   '#7038F8', dark:     '#705848', fairy:    '#EE99AC',
  normal:   '#A8A878', fighting: '#C03028', poison:   '#A040A0',
  ground:   '#E0C068', flying:   '#A890F0', bug:      '#A8B820',
  rock:     '#B8A038', ghost:    '#705898', steel:    '#B8B8D0',
};

const statLabels: Record<string, string> = {
  'hp':              'HP',
  'attack':          'ATK',
  'defense':         'DEF',
  'special-attack':  'SP.ATK',
  'special-defense': 'SP.DEF',
  'speed':           'SPD',
};

function getStatColor(value: number): string {
  if (value < 50)  return '#ff4444';
  if (value < 80)  return '#ffaa00';
  if (value < 100) return '#ffdd00';
  return '#1bd66f';
}

function formatGender(genderRate: number): string {
  if (genderRate === -1) return 'Genderless';
  const femaleRatio = genderRate * 12.5;
  const maleRatio   = 100 - femaleRatio;
  return `${maleRatio}% ♂ / ${femaleRatio}% ♀`;
}

function formatGeneration(gen: string): string {
  return gen.replace('generation-', 'Gen ').toUpperCase();
}

export const PokemonDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, fetchPokemonDetails } = useContext(PokemonContext);

  const currentId = Number(id);
  const prevId = currentId > 1 ? currentId - 1 : null;
  const nextId = currentId < 1025 ? currentId + 1 : null;

  useEffect(() => {
    if (id) fetchPokemonDetails(id);
  }, [id, fetchPokemonDetails]);

  const pokemon = state.selectedPokemon;

  if (state.loadingDetails || !pokemon || String(pokemon.id) !== id) {
    return <div className="dex-loading">Loading Pokédex...</div>;
  }

  const sprite = pokemon.sprites.animated;
  const dexNumber = `#${String(pokemon.id).padStart(3, '0')}`;

  return (
    <>
      {prevId && (
        <button className="dex-float-nav dex-float-nav--prev" onClick={() => navigate(`/pokemon/${prevId}`)}>
          ◀<span>PREV</span>
        </button>
      )}
      {nextId && (
        <button className="dex-float-nav dex-float-nav--next" onClick={() => navigate(`/pokemon/${nextId}`)}>
          <span>NEXT</span>▶
        </button>
      )}
    <div className="dex-page">

      {/* ── Header bar ── */}
      <div className="dex-header">
        <Link to="/pokemons" className="dex-back">← BACK</Link>
        <span className="dex-number">{dexNumber}</span>
        <span className="dex-title">{pokemon.name.toUpperCase()}</span>
        <div className="dex-types">
          {pokemon.types.map(({ type }) => (
            <span
              key={type.name}
              className="dex-type-badge"
              style={{ backgroundColor: typeColors[type.name] ?? '#888' }}
            >
              {type.name.toUpperCase()}
            </span>
          ))}
        </div>
      </div>

      {/* ── Main panel: screen + quick info ── */}
      <div className="dex-main">
        <div className="dex-screen">
          <div className="dex-screen-inner">
            {sprite
              ? <img src={sprite} alt={pokemon.name} className="dex-sprite" />
              : <span className="dex-no-sprite">?</span>
            }
          </div>
          <div className="dex-screen-label">PRESS START 2P</div>
        </div>

        <div className="dex-quick-info">
          <table className="dex-info-table">
            <tbody>
              <tr><td>HT</td><td>{pokemon.height / 10} m</td></tr>
              <tr><td>WT</td><td>{pokemon.weight / 10} kg</td></tr>
              <tr><td>EXP</td><td>{pokemon.base_experience}</td></tr>
              <tr><td>CAP</td><td>{pokemon.capture_rate}</td></tr>
            </tbody>
          </table>

          <div className="dex-abilities">
            <div className="dex-section-label">ABILITY</div>
            {pokemon.abilities.map(({ ability, is_hidden }) => (
              <div key={ability.name} className={`dex-ability${is_hidden ? ' dex-ability--hidden' : ''}`}>
                {ability.name.replace('-', ' ').toUpperCase()}
                {is_hidden && <span className="dex-hidden-tag">HIDDEN</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Pokédex entry ── */}
      <div className="dex-entry">
        <div className="dex-section-label">POKÉDEX ENTRY</div>
        <p className="dex-flavor">{pokemon.description}</p>
      </div>

      {/* ── Base stats ── */}
      <div className="dex-stats-panel">
        <div className="dex-section-label">BASE STATS</div>
        {pokemon.stats.map(({ stat, base_stat }) => (
          <div key={stat.name} className="dex-stat-row">
            <span className="dex-stat-name">{statLabels[stat.name] ?? stat.name}</span>
            <span className="dex-stat-value">{base_stat}</span>
            <div className="dex-stat-bar">
              <div
                key={`${pokemon.id}-${stat.name}`}
                className="dex-stat-fill"
                style={{
                  '--stat-width': `${Math.round((base_stat / 255) * 100)}%`,
                  backgroundColor: getStatColor(base_stat),
                } as React.CSSProperties}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ── Training & Breeding ── */}
      <div className="dex-extra">
        <div className="dex-extra-panel">
          <div className="dex-section-label">TRAINING</div>
          <div className="dex-extra-row"><span>Growth Rate</span><span>{pokemon.growth_rate.name.replace('-', ' ').toUpperCase()}</span></div>
          <div className="dex-extra-row"><span>Base EXP</span><span>{pokemon.base_experience}</span></div>
          <div className="dex-extra-row"><span>Capture Rate</span><span>{pokemon.capture_rate}</span></div>
        </div>

        <div className="dex-extra-panel">
          <div className="dex-section-label">BREEDING</div>
          <div className="dex-extra-row"><span>Gender</span><span>{formatGender(pokemon.gender_rate)}</span></div>
          <div className="dex-extra-row"><span>Egg Groups</span><span>{pokemon.egg_groups.map(g => g.name.toUpperCase()).join(', ')}</span></div>
          <div className="dex-extra-row"><span>Habitat</span><span>{pokemon.habitat?.name.toUpperCase() ?? '—'}</span></div>
          <div className="dex-extra-row"><span>Generation</span><span>{formatGeneration(pokemon.generation.name)}</span></div>
        </div>
      </div>

    </div>
    </>
  );
};
