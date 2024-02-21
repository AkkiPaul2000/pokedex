import React, { useEffect } from 'react'
import { getInitialPokemonData } from '../app/reducers/getInitialPokemonData'
import { useAppDispatch } from '../app/hooks'
import { useSelector } from 'react-redux'

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
      console.log(randomPokemonsID)
    }
  },[allPokemon])
  return (
    <div>Search</div>
  )
}

export default Search