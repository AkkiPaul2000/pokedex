import React from 'react'
import { useAppSelector } from '../../app/hooks'
import PokemonContainer from '../../components/PokemonContainer'
import PokeInfo from '../../components/PokeInfo'

function Description() {
  const pokemonData=useAppSelector(({pokemon:{currentPokemon}})=>currentPokemon)

  return (
    <div>
      {pokemonData && <PokeInfo data={pokemonData} />}
      {pokemonData && <PokemonContainer image={pokemonData?.image!} />}
    </div>
  )
}

export default Description