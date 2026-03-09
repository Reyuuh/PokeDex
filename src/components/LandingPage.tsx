import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FloatingBalls } from "./FloatingBalls";
import '../styles/LandingPage.scss';

interface FeaturedPokemon {
  name: string;
  artwork: string;
  types: string[];
  funFact: string;
}

const TYPE_COLORS: Record<string, string> = {
  fire:     '#FF4500', water:    '#1E90FF', grass:    '#2ECC40',
  electric: '#FFD700', psychic:  '#FF1493', ice:      '#00CFCF',
  dragon:   '#5B00FF', dark:     '#3D2B1F', fairy:    '#FF69B4',
  normal:   '#8A8A6A', fighting: '#CC1100', poison:   '#9B00CC',
  ground:   '#C8860A', flying:   '#7B68EE', bug:      '#6AAF00',
  rock:     '#A67C00', ghost:    '#4B0082', steel:    '#708090',
};

export const LandingPage: React.FC = () => {
  const [featured, setFeatured] = useState<FeaturedPokemon | null>(null);

  useEffect(() => {
    const randomId = Math.floor(Math.random() * 1025) + 1;

    fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`)
      .then(r => r.json())
      .then(async data => {
        const artwork =
          data.sprites.other?.["official-artwork"]?.front_default ||
          data.sprites.front_default;

        const speciesRes = await fetch(data.species.url);
        const speciesData = await speciesRes.json();

        const entry = speciesData.flavor_text_entries.find(
          (e: { language: { name: string } }) => e.language.name === "en"
        );
        const funFact = entry?.flavor_text.replace(/\n|\f/g, " ") ?? "";

        if (artwork) {
          setFeatured({
            name: data.name,
            artwork,
            types: data.types.map((t: { type: { name: string } }) => t.type.name),
            funFact,
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <>
    <FloatingBalls />
    <div className="landingpage-container">
      <div className="landing-panel">

        {/* Header */}
        <div className="landing-header">
          <div className="landing-lights">
            <span className="landing-light landing-light--blue" />
            <span className="landing-light landing-light--red" />
            <span className="landing-light landing-light--yellow" />
          </div>
          <h1 className="landing-title">POKÉDEX</h1>
        </div>

        {/* Screen */}
        <div className="landing-screen">
          {featured ? (
            <div className="landing-pokemon">
              <img
                className="landing-pokemon-img"
                src={featured.artwork}
                alt={featured.name}
              />
              <p className="landing-pokemon-name">{featured.name.toUpperCase()}</p>
              <div className="landing-pokemon-types">
                {featured.types.map(type => (
                  <span
                    key={type}
                    className="landing-type-badge"
                    style={{ backgroundColor: TYPE_COLORS[type] ?? '#888' }}
                  >
                    {type.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="landing-screen-loading">
              <span className="landing-question">?</span>
              <span className="landing-loading-text">LOADING...</span>
            </div>
          )}
        </div>

        {/* Fun fact */}
        {featured?.funFact && (
          <div className="landing-fact">
            <span className="landing-fact-label">POKÉDEX ENTRY</span>
            <p className="landing-fact-text">{featured.funFact}</p>
          </div>
        )}

        {/* Footer */}
        <div className="landing-footer">
          <p className="landing-tagline">1,025 Pokémon in the database</p>
          <Link className="landing-start-btn" to="/pokemons">
            ▶&nbsp;&nbsp;PRESS START
          </Link>
        </div>

      </div>
    </div>
    </>
  );
};
