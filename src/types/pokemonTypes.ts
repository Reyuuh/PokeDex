export interface Pokemon {
    id:number
    name: string;
    url: string;
    sprites: {
        front_default: string; // Regular sprite
        versions: {
            'generation-v': {
                'black-white': {
                    animated: {
                        front_default: string; // GIF sprite
                    };
                };
            };
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
