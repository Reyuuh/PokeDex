import { usePokemon } from "./usePokemon";

export const usePokemonSearch = () => {
  const { dispatch } = usePokemon();

  // search Pokémon function
  const searchPokemon = async (query: string) => {
    if (!query) {
      dispatch({ type: "SET_SEARCH_RESULT", payload: [] });
      return;
    }

    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`);
      if (res.ok) {
        const pokemon = await res.json();
        dispatch({ type: "SET_SEARCH_RESULT", payload: [pokemon] });
      } else {
        filterPokemons(query);
      }
    } catch (error) {
      console.error("Error searching Pokémon:", error);
    }
  };

  // Filter Pokémon by name
  const filterPokemons = async (query: string) => {
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1000`);
      const data = await res.json();

      const filteredPokemons = data.results.filter((pokemon: { name: string }) =>
        pokemon.name.startsWith(query.toLowerCase())
      );

      const pokemons = await Promise.all(
        filteredPokemons.map(async (pokemon: { url: string }) => {
          const res = await fetch(pokemon.url);
          return res.json();
        })
      );

      dispatch({ type: "SET_SEARCH_RESULT", payload: pokemons });
    } catch (error) {
      console.error("Error filtering Pokémon:", error);
    }
  };

  return { searchPokemon };
};
