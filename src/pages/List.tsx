import React from 'react'
import Wrapper from '../sections/Wrapper'
import { useAppSelector } from '../app/hooks'
import Login from '../auth/Login'
import PokemonCardGrid from '../components/PokemonCardGrid'

// The list itself is loaded on sign-in (App) and kept in sync by add/remove.
function List() {
  const userInfo = useAppSelector(({ app }) => app.userInfo)
  const userPokemons = useAppSelector(({ pokemon }) => pokemon.userPokemons)
  return (
    <div className="list">
      {userInfo ? <PokemonCardGrid pokemons={userPokemons} /> : <Login />}
    </div>
  )
}

export default Wrapper(List)
