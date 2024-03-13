import React, { useEffect } from 'react'
import Wrapper from '../sections/Wrapper'
import { useAppSelector } from '../app/hooks'
import Login from '../auth/Login'
import PokemonCardGrid from '../components/PokemonCardGrid'
import { useDispatch } from 'react-redux'
import { getUserPokemons } from '../app/reducers/getUserPokemons'

function List() {
  const {userInfo}=useAppSelector(({app})=>app)
  const {userPokemons}=useAppSelector(({pokemon})=>pokemon)
  const dispatch=useDispatch()
  console.log(userPokemons)
  useEffect(()=>{
    //@ts-ignore
    dispatch(getUserPokemons())
  },[dispatch,userInfo])
  return (
    <div className="list">
      {userPokemons?<PokemonCardGrid pokemons={userPokemons}/>:<Login/>}
    </div>  
  )
}

export default Wrapper(List)