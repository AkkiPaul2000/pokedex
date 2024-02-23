import { createAsyncThunk } from "@reduxjs/toolkit";
import { generatedPokemonType, genericPokemonType } from "../../utils/Types";

export const getPokemonData=createAsyncThunk("pokemon/randomPokemon",async(pokemons:genericPokemonType[])=>{
    try{
        const pokemonsData:generatedPokemonType[]=[];
        console.log({pokemons},"from reducer")
    }
    catch{
        console.error("OOPS an ERRROR")
    }
})