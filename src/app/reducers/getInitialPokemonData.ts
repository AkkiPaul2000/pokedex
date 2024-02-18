import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { pokemonRoute } from "../../utils/Constant";


export const getInitialPokemonData=createAsyncThunk(
    "pokemon/initialData",
    async()=>{
        try{
            const {data}=await axios.get(pokemonRoute);
            console.log({data});
            return data.results;
        }
        catch(err){
            console.log(err)
        }
    }
)