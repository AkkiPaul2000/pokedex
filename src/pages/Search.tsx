import React, { useEffect } from 'react'
import { getInitialPokemonData } from '../app/reducers/getInitialPokemonData'
import { useAppDispatch } from '../app/hooks'
import { useSelector } from 'react-redux'
import { getPokemonsData } from '../app/reducers/getPokemonsData'
import PokemonCardGrid from '../components/PokemonCardGrid'
import Wrapper from '../sections/Wrapper'
import { debounce } from '../utils/Debounce'

function Search() {
  const dispatch=useAppDispatch()
  const {allPokemon,randomPokemons}=useSelector(({pokemon})=>pokemon)
  function print(e:any){
    console.log(e)
  }
  const handleChange=debounce((value:string)=>handlePokemon(value),300)

  useEffect(()=>{
    dispatch(getInitialPokemonData())
  },[dispatch])
  useEffect(()=>{
    if(allPokemon){
      const clonedPokemon=[...allPokemon]
      const randomPokemonsID=clonedPokemon.sort(()=>Math.random()-Math.random()).slice(0,20)
      dispatch(getPokemonsData(randomPokemonsID))
    }
  },[allPokemon,dispatch])
  console.log(randomPokemons)
  const handlePokemon=async(value:string)=>{
    console.log(value)
    if(value.length){
      const pokemon=allPokemon?.filter((pokemon:any)=>pokemon.name.includes(value.toLowerCase()))
      dispatch(getPokemonsData(pokemon!))
    }
    else{
      const clonedPokemon=[...(allPokemon as [])]
      const randomPokemonsID=clonedPokemon.sort(()=>Math.random()-Math.random()).slice(0,20);
      dispatch(getPokemonsData(randomPokemonsID))
    }
  }
  return (
    <div className='search'> 
      <input className='bar' type='text' placeholder='Search Pokemon' onChange={(e)=>handleChange(e.target.value)}  />
      <PokemonCardGrid pokemons={randomPokemons!}/>
    </div>
)
}
export default Wrapper(Search)