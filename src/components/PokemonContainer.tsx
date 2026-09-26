import React from 'react'

function PokemonContainer({image}:{image:string}) {
  return (
    <div className='circle-container tilt'>
        <div className="outer-circle">
            <div className="inner-circle"></div>
            <div className='lines'>
                <div className="line line-1"></div>
                <div className="line line-2"></div>
            </div>
        </div>
        <img src={image} alt='pokemon' />
    </div>
  )
}

export default PokemonContainer
