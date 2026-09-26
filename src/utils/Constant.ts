export const pokemonApi = "https://pokeapi.co/api/v2";
export const pokemonsRoute = `${pokemonApi}/pokemon?limit=5000`;
export const pokemonRoute = `${pokemonApi}/pokemon`;

// Keyed by the roman numeral in PokeAPI's "generation-iv" names.
export const regions: Record<string, string> = {
  i: "Kanto", ii: "Johto", iii: "Hoenn", iv: "Sinnoh", v: "Unova",
  vi: "Kalos", vii: "Alola", viii: "Galar", ix: "Paldea",
};



export const pokemonTabs = {
    description: "description",
    evolution: "evolution",
    locations: "locations",
    moves: "moves",
  };

  