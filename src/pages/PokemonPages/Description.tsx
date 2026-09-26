import React from 'react'
import { useAppSelector } from '../../app/hooks'
import PokemonContainer from '../../components/PokemonContainer'
import PokeInfo from '../../components/PokeInfo'

function Description() {
  const pokemonData=useAppSelector(({pokemon:{currentPokemon}})=>currentPokemon)
  if (!pokemonData) return null

  return (
    <div className='pokemon-detail' data-jp={pokemonData.japaneseName}>
      <PokeInfo data={pokemonData} />
      <PokemonContainer image={pokemonData.image} />
    </div>
  )
}

export default Description
