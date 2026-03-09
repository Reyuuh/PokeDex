export interface Pokemon {
  id: number;
  name: string;
  url: string;
  height: number;
  weight: number;
  abilities: { ability: { name: string }; is_hidden: boolean }[];
  sprites: {
    front_default: string | null;
    other?: {
      "official-artwork"?: {
        front_default: string | null;
      };
    };
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
  base_experience: number;
  sprites: {
    front_default: string;
    animated?: string | null;
  };
  types: { type: { name: string } }[];
  abilities: { ability: { name: string }; is_hidden: boolean }[];
  stats: { base_stat: number; stat: { name: string } }[];
  description?: string;
  capture_rate: number;
  gender_rate: number;
  egg_groups: { name: string }[];
  habitat: { name: string } | null;
  growth_rate: { name: string };
  generation: { name: string };
}


export type SortBy = 'id-asc' | 'id-desc' | 'name-asc' | 'name-desc';

export interface State {
  pokemons: Pokemon[];
  nextPage: number;
  searchQuery: string;
  totalCount: number;
  searchResults: Pokemon[];
  selectedPokemon?: PokemonDetails;
  loadingDetails: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  isSearching: boolean;
  filterType: string | null;
  filterGen: number | null;
  sortBy: SortBy;
}

export type Action =
  | { type: "APPEND_POKEMONS"; payload: Pokemon[] }
  | { type: "SET_NEXT_PAGE"; payload: number }
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_TOTAL_COUNT"; payload: number }
  | { type: "SET_SEARCH_RESULT"; payload: Pokemon[] }
  | { type: "SET_SELECTED_POKEMON"; payload: PokemonDetails | undefined }
  | { type: "SET_LOADING_DETAILS"; payload: boolean }
  | { type: "SET_LOADING_MORE"; payload: boolean }
  | { type: "SET_HAS_MORE"; payload: boolean }
  | { type: "SET_IS_SEARCHING"; payload: boolean }
  | { type: "SET_FILTER_TYPE"; payload: string | null }
  | { type: "SET_FILTER_GEN"; payload: number | null }
  | { type: "SET_SORT_BY"; payload: SortBy };
