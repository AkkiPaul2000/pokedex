import React from 'react'
import { useAppSelector } from '../../app/hooks'

function Locations() {
  const pokemonData=useAppSelector(({pokemon:{currentPokemon}})=>currentPokemon)
  return (
    <div className='pokemon-locations'>
      <ul className='pokemon-locations-list'>
        {
          pokemonData?.encounters.map((encounters:string)=><li key={encounters} className='pokemon-location'>{encounters}</li>)
        }
      </ul>
    </div>
  )
}

export default Locations