export interface AppTypeInitialState{}

export interface PokemonTypeInitialState{
    allPokemon:undefined|genericPokemonType[];
    randomPokemons:generatedPokemonType[]| undefined;
}

export interface genericPokemonType{
    name:string;
    url:string;
}

export interface generatedPokemonType {
    name: string;
    id: number;
    image: string;
    types: pokemonTypeInterface[];
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
export interface userPokemonType extends generatedPokemonType{
  firebaseId:string;
}