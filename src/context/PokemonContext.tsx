import React, { createContext, ReactNode, useEffect, useReducer, useCallback } from "react";
import { Pokemon, Action, State, PokemonDetails } from "../types/pokemonTypes";

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
      return { ...state, searchResults: action.payload };
    case "SET_SELECTED_POKEMON":
      return { ...state, selectedPokemon: action.payload };
    case "SET_LOADING_DETAILS": // <- add here
      return { ...state, loadingDetails: action.payload };
    default:
      return state;
  }
};

// Create Context
export const PokemonContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
  fetchPokemonDetails: (nameOrId: string | number) => Promise<void>;
}>({
  state: {
    pokemonsByPage: {},
    currentPage: 1,
    searchQuery: "",
    totalCount: 0,
    searchResults: [],
    selectedPokemon: undefined,
    loadingDetails: false
  },
  dispatch: () => {},
  fetchPokemonDetails: async () => {},
});


// Provider Component
export const PokemonProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
  pokemonsByPage: {},
  currentPage: 1,
  searchQuery: "",
  totalCount: 0,
  searchResults: [],
  selectedPokemon: undefined,
  loadingDetails: false, // new
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

const fetchPokemonDetails = useCallback(async (nameOrId: string | number) => {
  dispatch({ type: "SET_LOADING_DETAILS", payload: true });
  try {


    
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nameOrId}`);
    const pokemonData = await res.json();
   
    const animatedSprite =
    pokemonData.sprites.versions["generation-v"]?.["black-white"]?.animated
    ?.front_default || null;


    const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${nameOrId}`);
    const speciesData = await speciesRes.json();

    const flavorEntry = speciesData.flavor_text_entries.find(
      (entry: any) => entry.language.name === "en"
    );

   const pokemonDetails: PokemonDetails = {
  id: pokemonData.id,
  name: pokemonData.name,
  height: pokemonData.height,
  weight: pokemonData.weight,
  sprites: { 
    front_default: pokemonData.sprites.front_default,
    animated: animatedSprite
  },
  types: pokemonData.types,
  stats: pokemonData.stats,
  description: flavorEntry?.flavor_text.replace(/\n|\f/g, " "),
};

    dispatch({ type: "SET_SELECTED_POKEMON", payload: pokemonDetails });
  } catch (error) {
    console.error("Error fetching Pokémon details:", error);
  } finally {
    dispatch({ type: "SET_LOADING_DETAILS", payload: false });
  }
}, []);




  return (
    <PokemonContext.Provider value={{ state, dispatch, fetchPokemonDetails }}>
  {children}
</PokemonContext.Provider>
  );
};

