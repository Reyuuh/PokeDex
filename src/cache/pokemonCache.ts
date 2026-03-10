// Module-level caches — persist for the entire browser session

const pokemonCache = new Map<string, Promise<any>>();
let allNamesCache: Promise<{ name: string; url: string }[]> | null = null;

/** Fetch a single Pokémon by URL, returning the cached promise if already requested */
export function fetchPokemon(url: string): Promise<any> {
  if (!pokemonCache.has(url)) {
    pokemonCache.set(url, fetch(url).then(r => r.json()));
  }
  return pokemonCache.get(url)!;
}

/** Fetch the full Pokémon name list (limit=1025), cached after first call */
export function fetchAllNames(): Promise<{ name: string; url: string }[]> {
  if (!allNamesCache) {
    allNamesCache = fetch('https://pokeapi.co/api/v2/pokemon?limit=1025')
      .then(r => r.json())
      .then(d => d.results);
  }
  return allNamesCache;
}
