import React from 'react'
import pokeball1 from '../assets/pokeball.png'
import pokeball2 from '../assets/pokeball2.png'
function Background() {
  return (
    <div className='background'>
        <img src={pokeball1} className='pokemon pokemon1' />
        <img src={pokeball2} className='pokemon pokemon2' />
        <img src={pokeball1} className='pokemon pokemon3' />
        <img src={pokeball2} className='pokemon pokemon4' />
        <img src={pokeball1} className='pokemon pokemon5' />
        <img src={pokeball2} className='pokemon pokemon6' />
    </div>
  )
}
export default Background