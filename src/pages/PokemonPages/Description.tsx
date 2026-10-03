import React from 'react'
import { useAppSelector } from '../../app/hooks'
import PokemonContainer from '../../components/PokemonContainer'
import PokeInfo from '../../components/PokeInfo'

function Description() {
  const pokemonData=useAppSelector(({pokemon:{currentPokemon}})=>currentPokemon)
  if (!pokemonData) return null

  return (
    <div className='pokemon-detail'>
      <PokeInfo data={pokemonData} />
      <PokemonContainer id={pokemonData.id} />
    </div>
  )
}

export default Description
