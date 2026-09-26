// @ts-nocheck

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setLoading } from "../slices/AppSlice";
import { generatedPokemonType, genericPokemonType } from "../../utils/Types";
import { defaultImages, images } from "../../utils/pokemonImage";
import { pokemonTypes } from "../../utils/pokemonTypes";

export const getPokemonsData = createAsyncThunk(
  "pokemon/randomPokemon",
  async (pokemons: genericPokemonType[], { dispatch, signal }) => {
    dispatch(setLoading(true));
    try {
      const pokemonsData = await Promise.all(
        pokemons.map(async (pokemon): Promise<generatedPokemonType | undefined> => {
          const { data } = await axios.get(pokemon.url, { signal });
          const image: string = images[data.id] || defaultImages[data.id];
          if (!image) return undefined;
          return {
            name: pokemon.name,
            id: data.id,
            image,
            types: data.types.map(({ type: { name } }) => ({ [name]: pokemonTypes[name] })),
          };
        })
      );
      return pokemonsData.filter((pokemon) => pokemon !== undefined);
    } finally {
      // An aborted request was superseded; the newer one owns the loading flag.
      if (!signal.aborted) dispatch(setLoading(false));
    }
  }
);
