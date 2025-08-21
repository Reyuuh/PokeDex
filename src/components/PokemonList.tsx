import React from "react";
import { usePokemon } from "../hooks/usePokemon";
import { usePokemonSearch } from "../hooks/usePokemonSearch";
import { SearchBar } from "./SearchBar";
import { PokemonItem } from "./PokemonItem";
import { Pagination } from "./Pagination";
import '../styles/Pokemons.scss';
import '../styles/PokemonSprites.scss'
import { Link } from "react-router-dom";



export const PokemonList: React.FC = () => {
  const { state, dispatch } = usePokemon();
  const { searchPokemon } = usePokemonSearch();
  const ITEMS_PER_PAGE = 5;

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    dispatch({ type: "SET_SEARCH", payload: query });
    dispatch({ type: "SET_PAGE", payload: 1 });
    searchPokemon(query);
  };

  // Determine Pokémon list to display
  const pokemonsToDisplay = state.searchQuery
    ? state.searchResults
    : state.pokemonsByPage[state.currentPage] || [];

  // Total pages for pagination
  const totalPages = Math.ceil(state.totalCount / ITEMS_PER_PAGE);

  return (
    <div className="pokemon-container">
      <div className="title-container" >
      <Link className="pokedex-link" to="/">
      <h1 className="pokemon-title">PokéDex</h1>
      </Link>
      </div>

<Link className="pokedex-home-link" to="/">Return to start</Link>

      <SearchBar query={state.searchQuery} onSearchChange={handleSearchChange} />

      
      <ul className="pokemon-creatures">
        {pokemonsToDisplay.length > 0 ? (
          pokemonsToDisplay.map((pokemon) => <PokemonItem key={pokemon.id} pokemon={pokemon} />)
        ) : (
          <p className="loading">Loading...</p>
        )}
      </ul>
      {!state.searchQuery && <div className="pagination-wrapper">
      <Pagination
        currentPage={state.currentPage}
        totalPages={totalPages}
        onPageChange={(page) => dispatch({ type: "SET_PAGE", payload: page })}
      />
    </div>}
    </div>

    
  );
};































































// import React from "react";
// import { usePokemon } from "../hooks/usePokemon"; // Assuming this hook is correctly set up
// import { Link } from "react-router-dom";

// export const PokemonList: React.FC = () => {
//   const { state, dispatch } = usePokemon();
//   const ITEMS_PER_PAGE = 20;

//   // Handle search input change
//   const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const query = event.target.value;
//     dispatch({ type: "SET_SEARCH", payload: query }); // Update search query in global state
//     dispatch({ type: "SET_PAGE", payload: 1 }); // Reset page to 1 when search changes
//     searchPokemon(query); // Call searchPokemon with the current query
//   };

//   // Search Pokémon function, dispatched from context
//   const searchPokemon = async (query: string) => {
//     if (!query) {
//       // If query is empty, clear the search results
//       dispatch({ type: "SET_SEARCH_RESULT", payload: [] });
//       return;
//     }

//     // If the query is an exact match for a Pokémon name (not partial), fetch that Pokémon
//     try {
//       const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`);
//       if (res.ok) {
//         const pokemon = await res.json();
//         dispatch({ type: "SET_SEARCH_RESULT", payload: [pokemon] });
//       } else {
//         // If no exact match, fetch and filter Pokémon by the query
//         filterPokemons(query);
//       }
//     } catch (error) {
//       console.error("Error searching Pokémon:", error);
//     }
//   };

//   // Filter Pokémon by partial match (e.g., "p" will match all Pokémon starting with "p")
//   const filterPokemons = async (query: string) => {
//     try {
//       const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1000`); // Fetch a larger set of Pokémon
//       const data = await res.json();

//       // Filter the Pokémon based on whether their name starts with the query string
//       const filteredPokemons = data.results.filter((pokemon: { name: string }) =>
//         pokemon.name.startsWith(query.toLowerCase())
//       );

//       // Fetch full data for the filtered Pokémon
//       const pokemons = await Promise.all(
//         filteredPokemons.map(async (pokemon: { url: string }) => {
//           const res = await fetch(pokemon.url);
//           return res.json();
//         })
//       );

//       dispatch({ type: "SET_SEARCH_RESULT", payload: pokemons });
//     } catch (error) {
//       console.error("Error filtering Pokémon:", error);
//     }
//   };

//   // Determine whether to show search results or paginated results
//   const pokemonsToDisplay = state.searchQuery
//     ? state.searchResults // If there's a search query, show search results
//     : state.pokemonsByPage[state.currentPage] || []; // Otherwise, show the paginated Pokémon

//   // Total pages for pagination
//   const totalPages = Math.ceil(state.totalCount / ITEMS_PER_PAGE);

//   // Handle page change for pagination
//   const handlePageChange = (newPage: number) => {
//     if (newPage < 1 || newPage > totalPages) return;
//     dispatch({ type: "SET_PAGE", payload: newPage });
//   };

//   return (
//     <div>
//       <h1>Pokémon List</h1>
//       <input
//         type="text"
//         placeholder="Search Pokémon..."
//         value={state.searchQuery}
//         onChange={handleSearchChange}
//       />

//       {/* Render search results or paginated results */}
//       <ul>
//         {pokemonsToDisplay.length > 0 ? (
//           pokemonsToDisplay.map((pokemon) => (
//             <li key={pokemon.id}>
//               <Link to={`/pokemon/${pokemon.id}`}>{pokemon.name}</Link>
//               <div>
//                 {pokemon.sprites?.front_default ? (
//                   <img
//                     src={pokemon.sprites.versions["generation-v"]["black-white"].animated.front_default}
//                     alt={pokemon.name}
//                     width={80}
//                     height={80}
//                   />
//                 ) : (
//                   <p>No sprite available</p>
//                 )}
//               </div>
//             </li>
//           ))
//         ) : (
//           <p>No Pokémon found</p> // Handle case for no search results or empty page
//         )}
//       </ul>

//       {/* Pagination controls */}
//       {!state.searchQuery && ( // Only show pagination if there is no search query
//         <div>
//           <button
//             onClick={() => handlePageChange(state.currentPage - 1)}
//             disabled={state.currentPage === 1}
//           >
//             Previous
//           </button>
//           <span> Page {state.currentPage} of {totalPages}</span>
//           <button
//             onClick={() => handlePageChange(state.currentPage + 1)}
//             disabled={state.currentPage >= totalPages}
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };