import React from 'react'
import { useAppSelector } from '../../app/hooks'

function Locations() {
  const pokemonData=useAppSelector(({pokemon:{currentPokemon}})=>currentPokemon)
  return (
    <div className='pokemon-locations'>
      {!pokemonData?.encounters.length && <p className='pokemon-locations-empty'>No wild encounter data for this Pokémon.</p>}
      <ul className='pokemon-locations-list'>
        {
          pokemonData?.encounters.map((encounters:string)=><li key={encounters} className='pokemon-location tilt'>{encounters}</li>)
        }
      </ul>
    </div>
  )
}

export default Locations