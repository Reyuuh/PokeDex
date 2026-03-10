import { useRef } from "react";
import { usePokemon } from "./usePokemon";
import { fetchPokemon, fetchAllNames } from "../cache/pokemonCache";

export const usePokemonSearch = () => {
  const { dispatch } = usePokemon();
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchAbortRef = useRef<AbortController | null>(null);

  const searchPokemon = (query: string) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    searchAbortRef.current?.abort();

    if (!query) {
      dispatch({ type: "SET_SEARCH_RESULT", payload: [] });
      dispatch({ type: "SET_IS_SEARCHING", payload: false });
      return;
    }

    dispatch({ type: "SET_IS_SEARCHING", payload: true });

    debounceTimer.current = setTimeout(async () => {
      const controller = new AbortController();
      searchAbortRef.current = controller;

      try {
        const res = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`,
          { signal: controller.signal }
        );
        if (res.ok) {
          const pokemon = await res.json();
          dispatch({ type: "SET_SEARCH_RESULT", payload: [pokemon] });
        } else {
          await filterPokemons(query);
        }
      } catch (error: any) {
        if (error?.name !== "AbortError") {
          console.error("Error searching Pokémon:", error);
          dispatch({ type: "SET_SEARCH_RESULT", payload: [] });
        }
      } finally {
        dispatch({ type: "SET_IS_SEARCHING", payload: false });
      }
    }, 300);
  };

  const filterPokemons = async (query: string) => {
    // Uses cached name list — only fetched once ever
    const allNames = await fetchAllNames();

    const filtered = allNames.filter(p => p.name.startsWith(query.toLowerCase()));

    const pokemons = await Promise.all(
      filtered.map(p => fetchPokemon(p.url))
    );

    dispatch({ type: "SET_SEARCH_RESULT", payload: pokemons });
  };

  return { searchPokemon };
};
