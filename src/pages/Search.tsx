import React, { useEffect } from 'react'
import { getInitialPokemonData } from '../app/reducers/getInitialPokemonData'
import { useAppDispatch } from '../app/hooks'
import { useSelector } from 'react-redux'
import { getPokemonsData } from '../app/reducers/getPokemonsData'

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
      dispatch(getPokemonsData(randomPokemonsID))
    }
  },[allPokemon,dispatch])
  return (
    <div>Search</div>
  )
}

export default Search