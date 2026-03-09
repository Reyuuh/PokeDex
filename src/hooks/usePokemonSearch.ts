import { usePokemon } from "./usePokemon";

export const usePokemonSearch = () => {
  const { dispatch } = usePokemon();

  const searchPokemon = async (query: string) => {
    if (!query) {
      dispatch({ type: "SET_SEARCH_RESULT", payload: [] });
      dispatch({ type: "SET_IS_SEARCHING", payload: false });
      return;
    }

    dispatch({ type: "SET_IS_SEARCHING", payload: true });

    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`);
      if (res.ok) {
        const pokemon = await res.json();
        dispatch({ type: "SET_SEARCH_RESULT", payload: [pokemon] });
      } else {
        await filterPokemons(query);
      }
    } catch (error) {
      console.error("Error searching Pokémon:", error);
      dispatch({ type: "SET_SEARCH_RESULT", payload: [] });
    } finally {
      dispatch({ type: "SET_IS_SEARCHING", payload: false });
    }
  };

  const filterPokemons = async (query: string) => {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1000`);
    const data = await res.json();

    const filtered = data.results.filter((p: { name: string }) =>
      p.name.startsWith(query.toLowerCase())
    );

    const pokemons = await Promise.all(
      filtered.map(async (p: { url: string }) => {
        const r = await fetch(p.url);
        return r.json();
      })
    );

    dispatch({ type: "SET_SEARCH_RESULT", payload: pokemons });
  };

  return { searchPokemon };
};
