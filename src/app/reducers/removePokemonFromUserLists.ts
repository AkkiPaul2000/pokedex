import { createAsyncThunk } from "@reduxjs/toolkit";
import { deleteDoc, doc } from "firebase/firestore";
import { pokemonListRef } from "../../utils/FirebaseConfig";
import { setToast } from "../slices/AppSlice";

// Rejects on failure, so the card stays in the list instead of vanishing from the UI only.
export const removePokemon = createAsyncThunk(
  "pokemon/remove",
  async ({ id, name }: { id: string; name: string }, { dispatch }) => {
    try {
      await deleteDoc(doc(pokemonListRef, id));
      dispatch(setToast(`${name} removed from your list.`));
      return { id };
    } catch (err) {
      dispatch(setToast(`Couldn't remove ${name}. Please try again.`));
      throw err;
    }
  }
);
