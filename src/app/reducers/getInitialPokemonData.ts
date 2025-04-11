import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { pokemonsRoute } from "../../utils/Constant";
import { setLoading } from "../slices/AppSlice";

export const getInitialPokemonData = createAsyncThunk(
    "pokemon/initialData",
    async (_, { dispatch }) => {
        try {
            dispatch(setLoading(true));
            const { data } = await axios.get(pokemonsRoute);
            dispatch(setLoading(false));
            return data.results;
        }
        catch (err) {
            dispatch(setLoading(false));
            console.log(err);
            throw err;
        }
    }
);