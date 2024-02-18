import React, { useEffect } from 'react'
import { getInitialPokemonData } from '../app/reducers/getInitialPokemonData'
import { useAppDispatch } from '../app/hooks'

function Search() {
  const dispatch=useAppDispatch()
  useEffect(()=>{
    dispatch(getInitialPokemonData())
  },[dispatch])
  return (
    <div>Search</div>
  )
}

export default Search