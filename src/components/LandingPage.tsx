import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DEX_TYPE_COLORS } from "../constants/typeColors";
import '../styles/LandingPage.scss';

interface FeaturedPokemon {
  name: string;
  artwork: string;
  types: string[];
  funFact: string;
}

export const LandingPage: React.FC = () => {
  const [featured, setFeatured] = useState<FeaturedPokemon | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    const randomId = Math.floor(Math.random() * 1025) + 1;

    (async () => {
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`, { signal });
        const data = await res.json();

        const artwork =
          data.sprites.other?.["official-artwork"]?.front_default ||
          data.sprites.front_default;

        const speciesRes = await fetch(data.species.url, { signal });
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
      } catch (e: any) {
        if (e?.name !== "AbortError") console.error(e);
      }
    })();

    return () => controller.abort();
  }, []);

  return (
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
                    style={{ backgroundColor: DEX_TYPE_COLORS[type] ?? '#888' }}
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
  );
};
