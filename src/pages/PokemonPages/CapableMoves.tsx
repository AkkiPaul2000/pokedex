import React, { useEffect } from 'react'
import { useAppSelector } from '../../app/hooks'

function CapableMoves() {
  const pokemonData=useAppSelector(({pokemon:{currentPokemon}})=>currentPokemon)
  useEffect(()=>console.log(pokemonData))
  return (
    <div className='page capable-moves'>
      <h1 className='capable-moves-title'>Abilities</h1>
      <ul className="capable-moves-list ability">{pokemonData?.pokemonAbilities.abilities.map((abilities:string)=>
      <li key={abilities} className='move'>{abilities}</li>)}
      </ul>
      <h1 className='capable-moves-title'>Moves</h1>
      <ul className='capable-moves-list'>{pokemonData?.pokemonAbilities.moves.map((move:string)=>
      <li key={move} className='move'>{move}</li>)}
      </ul>
    </div>
  )
}

export default CapableMoves