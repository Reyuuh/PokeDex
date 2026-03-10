import React, { useEffect, useRef, useMemo, useState, useCallback } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { usePokemon } from "../hooks/usePokemon";
import { usePokemonSearch } from "../hooks/usePokemonSearch";
import { SearchBar } from "./SearchBar";
import { FilterBar } from "./FilterBar";
import { PokemonItem } from "./PokemonItem";
import { SortBy } from "../types/pokemonTypes";
import '../styles/PokemonList.scss';
import '../styles/PokemonItem.scss';
import { Link } from "react-router-dom";

// Card width (15rem) + gap (2rem) in px at 16px base
const CARD_WIDTH = 240;
const CARD_GAP   = 32;
const ROW_HEIGHT = CARD_WIDTH + CARD_GAP; // 272px

function getColumns() {
  return Math.max(1, Math.floor((window.innerWidth - CARD_GAP) / (CARD_WIDTH + CARD_GAP)));
}

export const PokemonList: React.FC = () => {
  const { state, dispatch, loadMore, fetchPokemonsForGen } = usePokemon();
  const { searchPokemon } = usePokemonSearch();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const [columns, setColumns] = useState(getColumns);

  useEffect(() => {
    const onResize = () => setColumns(getColumns());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    dispatch({ type: "SET_SEARCH", payload: query });
    searchPokemon(query);
  };

  // Trigger loadMore when sentinel scrolls into view
  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMore(); },
      { rootMargin: "200px" }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [loadMore]);

  // After each batch finishes, check if sentinel is still on-screen
  useEffect(() => {
    if (!state.isLoadingMore && state.hasMore && sentinelRef.current) {
      const rect = sentinelRef.current.getBoundingClientRect();
      if (rect.top <= window.innerHeight + 200) loadMore();
    }
  }, [state.isLoadingMore]);

  const GEN_RANGES: Record<number, [number, number]> = {
    1: [1, 151], 2: [152, 251], 3: [252, 386],
    4: [387, 493], 5: [494, 649], 6: [650, 721],
    7: [722, 809], 8: [810, 905], 9: [906, 1025],
  };

  useEffect(() => {
    if (state.filterGen) {
      const [min, max] = GEN_RANGES[state.filterGen];
      fetchPokemonsForGen(min, max);
    }
  }, [state.filterGen]);

  const filteredPokemons = useMemo(() => {
    let list = state.filterGen ? [...state.genPokemons] : [...state.pokemons];

    if (state.filterType) {
      list = list.filter(p => p.types.some(t => t.type.name === state.filterType));
    }

    switch (state.sortBy) {
      case 'id-asc':   list.sort((a, b) => a.id - b.id); break;
      case 'id-desc':  list.sort((a, b) => b.id - a.id); break;
      case 'name-asc': list.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'name-desc':list.sort((a, b) => b.name.localeCompare(a.name)); break;
    }

    return list;
  }, [state.pokemons, state.genPokemons, state.filterType, state.filterGen, state.sortBy]);

  const isSearchMode = Boolean(state.searchQuery);
  const pokemonsToDisplay = isSearchMode ? state.searchResults : filteredPokemons;

  const rowCount = Math.ceil(pokemonsToDisplay.length / columns);

  const virtualizer = useWindowVirtualizer({
    count: rowCount,
    estimateSize: () => ROW_HEIGHT,
    overscan: 3,
    scrollMargin: listRef.current?.offsetTop ?? 0,
  });

  return (
    <div className="pokemon-container">
      <div className="title-container">
        <Link className="pokedex-link" to="/">
          <h1 className="pokemon-title">PokéDex</h1>
        </Link>
      </div>

      <Link className="pokedex-home-link" to="/">Return to start</Link>

      <SearchBar query={state.searchQuery} onSearchChange={handleSearchChange} />

      {!isSearchMode && (
        <FilterBar
          filterType={state.filterType}
          filterGen={state.filterGen}
          sortBy={state.sortBy}
          onFilterType={(type) => dispatch({ type: "SET_FILTER_TYPE", payload: type })}
          onFilterGen={(gen) => dispatch({ type: "SET_FILTER_GEN", payload: gen })}
          onSortBy={(sort: SortBy) => dispatch({ type: "SET_SORT_BY", payload: sort })}
        />
      )}

      {/* Search empty states */}
      {isSearchMode && state.isSearching && (
        <p className="list-status">Searching...</p>
      )}
      {isSearchMode && !state.isSearching && state.searchResults.length === 0 && (
        <p className="list-status list-status--empty">No Pokémon found for "{state.searchQuery}"</p>
      )}

      {/* Virtual list */}
      <div ref={listRef} className="pokemon-creatures">
        <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
          {virtualizer.getVirtualItems().map(virtualRow => {
            const startIndex = virtualRow.index * columns;
            const rowItems = pokemonsToDisplay.slice(startIndex, startIndex + columns);
            return (
              <div
                key={virtualRow.key}
                className="pokemon-row"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  transform: `translateY(${virtualRow.start - virtualizer.options.scrollMargin}px)`,
                }}
              >
                {rowItems.map((pokemon, i) => (
                  <PokemonItem key={pokemon.id} pokemon={pokemon} index={startIndex + i} />
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Gen filter loading indicator */}
      {!isSearchMode && state.filterGen && state.isLoadingGen && (
        <p className="list-status">Loading generation...</p>
      )}

      {/* Sentinel — only active outside search mode and without gen filter */}
      {!isSearchMode && !state.filterGen && (
        <div ref={sentinelRef} className="load-sentinel">
          {state.isLoadingMore && <span className="load-spinner">Loading...</span>}
          {!state.hasMore && <span className="load-end">All Pokémon loaded</span>}
        </div>
      )}
    </div>
  );
};
