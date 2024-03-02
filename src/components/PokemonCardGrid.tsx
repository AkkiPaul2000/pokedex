import React from 'react'

function PokemonCardGrid({pokemons}:any) {
    console.log(pokemons)
  return (
    <div>{pokemons && pokemons.map((i:any)=><div>{i.name}<img src={i.image} alt={i.name}/></div>)}</div>
  )
}

export default PokemonCardGrid