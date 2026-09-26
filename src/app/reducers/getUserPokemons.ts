import { createAsyncThunk } from "@reduxjs/toolkit";
import { getDocs, query, where } from "firebase/firestore";
import type { RootState } from "../store";
import { pokemonListRef } from "../../utils/FirebaseConfig";
import { pokemonElementType, userPokemonType } from "../../utils/Types";
import { defaultImages, images } from "../../utils/pokemonImage";
import { pokemonTypes } from "../../utils/pokemonTypes";
import { setToast } from "../slices/AppSlice";

// Firestore stores { id, name, types: string[] }; cards need the sprite and type details.
export const toUserPokemon = (
  { id, name, types }: { id: number; name: string; types: string[] },
  firebaseId: string
): userPokemonType => ({
  id,
  name,
  firebaseId,
  image: images[id] || defaultImages[id],
  types: types.map((type) => ({ [type]: pokemonTypes[type as pokemonElementType] })),
});

// Always resolves to an array: a logged-out user simply has an empty list. On failure the
// thunk rejects, so the slice keeps its current (array) value instead of storing undefined.
export const getUserPokemons = createAsyncThunk(
  "pokemon/userList",
  async (_, { getState, dispatch }) => {
    const email = (getState() as RootState).app.userInfo?.email;
    if (!email) return [];
    try {
      const { docs } = await getDocs(query(pokemonListRef, where("email", "==", email)));
      return docs.map((doc) => toUserPokemon(doc.data().pokemon, doc.id));
    } catch (err) {
      dispatch(setToast(`Couldn't load your list: ${(err as Error).message}`));
      throw err;
    }
  }
);
