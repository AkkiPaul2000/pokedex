import React, { useEffect } from 'react'
import { getInitialPokemonData } from '../app/reducers/getInitialPokemonData'
import { useAppDispatch } from '../app/hooks'
import { useSelector } from 'react-redux'
import { getPokemonData } from '../app/reducers/getPokemonData'

function Search() {
  const dispatch=useAppDispatch()
  const {allPokemon}=useSelector(({pokemon})=>pokemon)
  useEffect(()=>{
    dispatch(getInitialPokemonData())
    
  },[dispatch])
  useEffect(()=>{
    if(allPokemon){
      const clonedPokemon=[...allPokemon]
      const randomPokemonsID=clonedPokemon.sort(()=>Math.random()-Math.random()).slice(0,20)
      dispatch(getPokemonData(randomPokemonsID))
    }
  },[allPokemon,dispatch])
  return (
    <div>Search</div>
  )
}

export default Search