import { createSlice } from "@reduxjs/toolkit";
import {PokemonTypeInitialState, generatedPokemonType} from "../../utils/Types"
import { getInitialPokemonData } from "../reducers/getInitialPokemonData";
import {  getPokemonsData } from "../reducers/getPokemonsData";
import { getUserPokemons } from "../reducers/getUserPokemons";
import { addPokemonToList } from "../reducers/addPokemonToList";
import { removePokemon } from "../reducers/removePokemonFromUserLists";
import { setUserStatus } from "./AppSlice";

// Footer saves `recent` so the trail survives a reload; storage can be missing or blocked.
const savedRecent=()=>{ try { return JSON.parse(localStorage.getItem("recent") || "[]") } catch { return [] } }

const initialState:PokemonTypeInitialState={
    allPokemon:undefined,
    randomPokemons:undefined,
    compareQueue:[],
    userPokemons:[],
    currentPokemon:undefined,
    recent:savedRecent(),
};
export const PokemonSlice=createSlice({
    name:"pokemon",
    initialState,
    reducers:{
        addToCompare:(state,action)=>{
            const index=state.compareQueue?.findIndex((pokemon:generatedPokemonType)=>pokemon.id===action.payload.id)
            if(index===-1){
                if(state.compareQueue.length===2){state.compareQueue.pop()}
                    state.compareQueue.unshift(action.payload)
            }
        },
        removeFromCompare: (state, action) => {
            state.compareQueue = state.compareQueue.filter((pokemon) => pokemon.id !== action.payload.id);
          },
          setCurrentPokemon:(state,action)=>{
            state.currentPokemon=action.payload;
            const {id,name}=action.payload;
            state.recent=[{id,name},...state.recent.filter((pokemon)=>pokemon.id!==id)].slice(0,12);
          }

    },
    extraReducers:(builder)=>{
        builder.addCase(getInitialPokemonData.fulfilled,(state,action)=>{state.allPokemon=action.payload})
        builder.addCase(getPokemonsData.fulfilled,(state,action)=>{state.randomPokemons=action.payload})
        builder.addCase(getUserPokemons.fulfilled,(state,action)=>{
            state.userPokemons=action.payload
        })
        builder.addCase(addPokemonToList.fulfilled,(state,{payload})=>{
            if(payload) state.userPokemons.push(payload)
        })
        builder.addCase(removePokemon.fulfilled,(state,{payload})=>{
            state.userPokemons=state.userPokemons.filter((pokemon)=>pokemon.firebaseId!==payload.id)
        })
        // A list and a compare queue belong to whoever is signed in.
        builder.addCase(setUserStatus,(state,{payload})=>{
            if(!payload){
                state.userPokemons=[]
                state.compareQueue=[]
            }
        })
    }
})
export const {addToCompare,removeFromCompare,setCurrentPokemon }=PokemonSlice.actions
