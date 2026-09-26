import React from 'react'
import Wrapper from '../sections/Wrapper'
import { useAppSelector } from '../app/hooks'
import CompareContainer from '../components/CompareContainer'

function Compare() {
  const compareQueue = useAppSelector(({ pokemon }) => pokemon.compareQueue)
  return (
    <div className='compare'>
      <CompareContainer pokemon={compareQueue[0]} />
      <CompareContainer pokemon={compareQueue[1]} />
    </div>
  )
}

export default Wrapper(Compare)
