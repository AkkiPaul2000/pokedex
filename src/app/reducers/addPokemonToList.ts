import { createAsyncThunk } from "@reduxjs/toolkit";
import { addDoc } from "firebase/firestore";
import type { RootState } from "../store";
import { pokemonTypeInterface, userPokemonType } from "../../utils/Types";
import { pokemonListRef } from "../../utils/FirebaseConfig";
import { setToast } from "../slices/AppSlice";
import { login } from "../../auth/Login";
import { toUserPokemon } from "./getUserPokemons";

const saving = new Set<number>(); // ids with a write in flight, so a double click can't save twice

// Callers pass types either as names (detail page) or as { name: details } objects (cards).
export const addPokemonToList = createAsyncThunk(
  "pokemon/addPokemon",
  async (
    pokemon: { id: number; name: string; types: (string | pokemonTypeInterface)[] },
    { getState, dispatch }
  ): Promise<userPokemonType | undefined> => {
    const {
      app: { userInfo },
      pokemon: { userPokemons },
    } = getState() as RootState;
    if (!userInfo?.email) {
      dispatch(login());
      return;
    }
    if (saving.has(pokemon.id) || userPokemons.some(({ id }) => id === pokemon.id)) {
      dispatch(setToast(`${pokemon.name} is already in your list.`));
      return;
    }
    const types = pokemon.types.map((type) => (typeof type === "string" ? type : Object.keys(type)[0]));
    saving.add(pokemon.id);
    try {
      const saved = { id: pokemon.id, name: pokemon.name, types };
      const { id: firebaseId } = await addDoc(pokemonListRef, { pokemon: saved, email: userInfo.email });
      dispatch(setToast(`${pokemon.name} added to your list.`));
      return toUserPokemon(saved, firebaseId);
    } catch (err) {
      // Surface it: a rejected write (e.g. Firestore rules) used to fail without a trace.
      console.error(err);
      dispatch(setToast(`Couldn't add ${pokemon.name}: ${(err as Error).message}`));
    } finally {
      saving.delete(pokemon.id);
    }
  }
);
