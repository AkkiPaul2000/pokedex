import React from 'react'
// First frame of the loader GIF, spun by CSS: reduced motion can stop it, and the GIF's blank last frame can't blink.
import pokeball from '../assets/pokeball-loader.png'

function PokemonContainer({image}:{image:string}) {
  return (
    <div className='circle-container tilt'>
        <div className='floor'><img src={pokeball} alt='' /></div>
        <img src={image} alt='pokemon' />
    </div>
  )
}

export default PokemonContainer
