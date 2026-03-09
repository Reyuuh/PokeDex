import React, { createContext, ReactNode, useEffect, useReducer, useCallback, useRef } from "react";
import { Pokemon, Action, State, PokemonDetails, SortBy } from "../types/pokemonTypes";

const ITEMS_PER_PAGE = 20;

// Reducer function
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "APPEND_POKEMONS":
      return { ...state, pokemons: [...state.pokemons, ...action.payload] };
    case "SET_NEXT_PAGE":
      return { ...state, nextPage: action.payload };
    case "SET_SEARCH":
      return { ...state, searchQuery: action.payload };
    case "SET_TOTAL_COUNT":
      return { ...state, totalCount: action.payload };
    case "SET_SEARCH_RESULT":
      return { ...state, searchResults: action.payload };
    case "SET_SELECTED_POKEMON":
      return { ...state, selectedPokemon: action.payload };
    case "SET_LOADING_DETAILS":
      return { ...state, loadingDetails: action.payload };
    case "SET_LOADING_MORE":
      return { ...state, isLoadingMore: action.payload };
    case "SET_HAS_MORE":
      return { ...state, hasMore: action.payload };
    case "SET_IS_SEARCHING":
      return { ...state, isSearching: action.payload };
    case "SET_FILTER_TYPE":
      return { ...state, filterType: action.payload };
    case "SET_SORT_BY":
      return { ...state, sortBy: action.payload };
    default:
      return state;
  }
};

const initialState: State = {
  pokemons: [],
  nextPage: 1,
  searchQuery: "",
  totalCount: 0,
  searchResults: [],
  selectedPokemon: undefined,
  loadingDetails: false,
  isLoadingMore: false,
  hasMore: true,
  isSearching: false,
  filterType: null,
  sortBy: 'id-asc',
};

export const PokemonContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
  fetchPokemonDetails: (nameOrId: string | number) => Promise<void>;
  loadMore: () => void;
}>({
  state: initialState,
  dispatch: () => {},
  fetchPokemonDetails: async () => {},
  loadMore: () => {},
});

export type { SortBy };

export const PokemonProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const isLoadingRef = useRef(false);
  const nextPageRef = useRef(1);
  const hasMoreRef = useRef(true);

  const fetchPokemons = useCallback(async () => {
    if (isLoadingRef.current || !hasMoreRef.current) return;

    isLoadingRef.current = true;
    dispatch({ type: "SET_LOADING_MORE", payload: true });

    try {
      const page = nextPageRef.current;
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${ITEMS_PER_PAGE}&offset=${(page - 1) * ITEMS_PER_PAGE}`
      );
      const data = await res.json();

      dispatch({ type: "SET_TOTAL_COUNT", payload: data.count });

      const pokemons: Pokemon[] = await Promise.all(
        data.results.map(async (p: { url: string }) => {
          const r = await fetch(p.url);
          return r.json();
        })
      );

      const more = page * ITEMS_PER_PAGE < data.count;
      dispatch({ type: "APPEND_POKEMONS", payload: pokemons });
      dispatch({ type: "SET_HAS_MORE", payload: more });
      dispatch({ type: "SET_NEXT_PAGE", payload: page + 1 });

      nextPageRef.current = page + 1;
      hasMoreRef.current = more;
    } catch (error) {
      console.error("Error fetching Pokémon:", error);
    } finally {
      isLoadingRef.current = false;
      dispatch({ type: "SET_LOADING_MORE", payload: false });
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchPokemons();
  }, [fetchPokemons]);

  const loadMore = useCallback(() => {
    fetchPokemons();
  }, [fetchPokemons]);

  const fetchPokemonDetails = useCallback(async (nameOrId: string | number) => {
    dispatch({ type: "SET_LOADING_DETAILS", payload: true });
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nameOrId}`);
      const pokemonData = await res.json();

      const animatedSprite =
        pokemonData.sprites.versions["generation-v"]?.["black-white"]?.animated?.front_default || null;

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
        base_experience: pokemonData.base_experience,
        sprites: {
          front_default: pokemonData.sprites.front_default,
          animated: animatedSprite,
        },
        types: pokemonData.types,
        abilities: pokemonData.abilities,
        stats: pokemonData.stats,
        description: flavorEntry?.flavor_text.replace(/\n|\f/g, " "),
        capture_rate: speciesData.capture_rate,
        gender_rate: speciesData.gender_rate,
        egg_groups: speciesData.egg_groups.map((g: { name: string }) => ({ name: g.name })),
        habitat: speciesData.habitat,
        growth_rate: speciesData.growth_rate,
        generation: speciesData.generation,
      };

      dispatch({ type: "SET_SELECTED_POKEMON", payload: pokemonDetails });
    } catch (error) {
      console.error("Error fetching Pokémon details:", error);
    } finally {
      dispatch({ type: "SET_LOADING_DETAILS", payload: false });
    }
  }, []);

  return (
    <PokemonContext.Provider value={{ state, dispatch, fetchPokemonDetails, loadMore }}>
      {children}
    </PokemonContext.Provider>
  );
};
