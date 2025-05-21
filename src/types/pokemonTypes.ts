export interface Pokemon {
  id: number;
  name: string;
  url: string;
  sprites: {
    front_default: string | null; // Static default sprite
    versions: {
      "generation-v"?: {
        "black-white"?: {
          animated?: {
            front_default: string | null; // Animated sprite for Gen V
          };
        };
      };
      "generation-vi"?: {
        "x-y"?: {
          animated?: {
            front_default: string | null; // Animated sprite for Gen VI
          };
        };
      };
      "generation-vii"?: {
        "ultra-sun-ultra-moon"?: {
          animated?: {
            front_default: string | null; // Animated sprite for Gen VII
          };
        };
      };
      "generation-viii"?: {
        animated?: {
          front_default: string | null; // Animated sprite for Gen VIII
        };
      };
      // Add other generations/versions here as needed
    };
  };
  types: { type: { name: string } }[];
}

export interface PokemonDetails {
    id: number;
    name: string;
    height: number;
    weight: number;
    sprites: {
        front_default: string;
    };
    types: {type: {name:string}} [];
}

export interface State {
    
    pokemonsByPage: { [key: number]: Pokemon[] };
    currentPage: number;
    searchQuery: string;
    totalCount: number;
    searchResults: Pokemon[];
};

export type Action = 
| { type: "SET_POKEMONS"; payload: { page: number; pokemons: Pokemon[] } }
| {type: "SET_PAGE"; payload: number}
| {type: "SET_SEARCH"; payload: string}
| {type: "SET_TOTAL_COUNT", payload: number}
| { type: "SET_SEARCH_RESULT"; payload: Pokemon[] };
