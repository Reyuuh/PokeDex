import React, { createContext, ReactNode, useEffect, useReducer, useCallback } from "react";
import { Pokemon, Action, State } from "../types/pokemonTypes";

// Reducer function
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_POKEMONS":
      return { 
        ...state, 
        pokemonsByPage: { 
          ...state.pokemonsByPage, 
          [action.payload.page]: action.payload.pokemons 
        } 
      };

    case "SET_PAGE":
      return { ...state, currentPage: action.payload };

    case "SET_SEARCH":
      return { ...state, searchQuery: action.payload };

    case "SET_TOTAL_COUNT":
      return { ...state, totalCount: action.payload };
    case "SET_SEARCH_RESULT":
      return {...state, searchResults: action.payload};
    default:
      return state;
  }
};

// Create Context
export const PokemonContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({
  state: {
    pokemonsByPage: {},
    currentPage: 1,
    searchQuery: "",
    totalCount: 0,
    searchResults: []
  },
  dispatch: () => {},
});

// Provider Component
export const PokemonProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    pokemonsByPage: {},
    currentPage: 1,
    searchQuery: "",
    totalCount: 0,
    searchResults: [],
  });

  const ITEMS_PER_PAGE = 15;
  // Fetch Pokémon Data
  const fetchPokemons = useCallback(async (page: number, itemsPerPage:number) => {
    if (state.pokemonsByPage[page]) return; // ✅ Avoid re-fetching existing pages

    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${itemsPerPage}&offset=${(page - 1) * itemsPerPage}`);
      const data = await res.json();

      dispatch({ type: "SET_TOTAL_COUNT", payload: data.count });

      const pokemons: Pokemon[] = await Promise.all(
        data.results.map(async (pokemon: { url: string }) => {
          const res = await fetch(pokemon.url);
          return res.json();
        })
      );

      dispatch({ type: "SET_POKEMONS", payload: { page, pokemons } }); // ✅ Save Pokémon under the correct page
    } catch (error) {
      console.error("Error fetching Pokémon:", error);
    }
  }, [state.pokemonsByPage]);

  // Fetch data whenever the page changes
  useEffect(() => {
  fetchPokemons(state.currentPage, ITEMS_PER_PAGE);
  dispatch({ type: "SET_TOTAL_COUNT", payload: 280 });

}, [state.currentPage, fetchPokemons]);


  return (
    <PokemonContext.Provider value={{ state, dispatch }}>
      {children}
    </PokemonContext.Provider>
  );
};

