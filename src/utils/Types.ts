export interface AppTypeInitialState {
  isLoading: boolean;
  userInfo: { email: string } | null;
  toasts: string[];
  currentPokemonTab: string;
  shiny: boolean;
}

export interface PokemonTypeInitialState {
  allPokemon: genericPokemonType[] | undefined;
  randomPokemons: generatedPokemonType[] | undefined;
  compareQueue: generatedPokemonType[];
  userPokemons: userPokemonType[];
  currentPokemon: currentPokemonType | undefined;
  recent: { id: number; name: string }[]; // opened Pokémon, newest first
}

export interface genericPokemonType {
  name: string;
  url: string;
}

export interface generatedPokemonType {
  name: string;
  id: number;
  image: string;
  types: pokemonTypeInterface[];
}

export interface userPokemonType extends generatedPokemonType {
  firebaseId?: string;
}

export interface currentPokemonType {
  id: number;
  name: string;
  types: pokemonElementType[];
  image: string;
  stats: pokemonStatsType[];
  encounters: string[];
  evolutionLevel?: number;
  evolution: { level: number; pokemon: { name: string; url: string } }[];
  pokemonAbilities: { abilities: string[]; moves: string[] };
  height: number; // metres
  weight: number; // kilograms
  genus?: string;
  description?: string;
  region?: string;
}

export interface pokemonStatsType {
  name: string;
  value: string;
}

export interface pokemonTypeInterface {
  [key: string]: {
    image: string;
    resistance: string[];
    strength: string[];
    weakness: string[];
    vulnerable: string[];
  };
}

export type pokemonStatType =
  | "vulnerable"
  | "weakness"
  | "strength"
  | "resistance";

export type pokemonElementType =
  | "bug"
  | "dark"
  | "dragon"
  | "electric"
  | "fairy"
  | "fighting"
  | "fire"
  | "flying"
  | "ghost"
  | "grass"
  | "ground"
  | "ice"
  | "normal"
  | "poison"
  | "psychic"
  | "rock"
  | "steel"
  | "water";