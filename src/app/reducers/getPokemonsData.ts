// @ts-nocheck

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setLoading } from "../slices/AppSlice";
import { generatedPokemonType, genericPokemonType } from "../../utils/Types";
import { defaultImages, images } from "../../utils/pokemonImage";
import { pokemonTypes } from "../../utils/pokemonTypes";

export const getPokemonsData = createAsyncThunk(
  "pokemon/randomPokemon",
  async (pokemons: genericPokemonType[], { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const pokemonsData: generatedPokemonType[] = [];
      for await (const pokemon of pokemons) {
        const {
          data,
        }: {
          data: {
            id: number;
            types: { type: genericPokemonType }[];
          };
        } = await axios.get(pokemon.url);
        const types = data.types.map(
          ({ type: { name } }: { type: { name: string } }) => ({
            [name]: pokemonTypes[name],
          })
        );
        let image: string = images[data.id];
        if (!image) {
          image = defaultImages[data.id];
        }
        if (image) {
          pokemonsData.push({
            name: pokemon.name,
            id: data.id,
            image,
            types,
          });
        }
      }
      dispatch(setLoading(false));
      return pokemonsData;
    } catch (err) {
      dispatch(setLoading(false));
      console.error(err);
      throw err;
    }
  }
);
