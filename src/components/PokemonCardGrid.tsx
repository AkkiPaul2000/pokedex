import React from 'react'
import { pokemonTypeInterface } from '../utils/Types'
import { IoGitCompare } from "react-icons/io5";
import { useLocation, useNavigate } from 'react-router-dom';
import { FaPlus } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";


function PokemonCardGrid({pokemons}:any) {
  const location=useLocation();
  const navigate=useNavigate()
  return (
    <div className='pokemon-card-grid-container'><div className='pokemon-card-grid'>
        {pokemons && pokemons.length>0 && 
        pokemons.map((poke:any)=><div className='pokemon-card' key={poke.id}>
            <div className='pokemon-card-list'>
            {location.pathname.includes("/pokemon")?<FaPlus className="plus"/>:location.pathname.includes("/search")?<FaPlus className="plus"/>:<FaTrash className='trash'/>}
            </div>
            <div className='pokemon-card-compare'><IoGitCompare /></div>
            <h3 className='pokemon-card-title'>{poke.name}</h3>
            <img src={poke.image} alt={poke.name} className='pokemon-card-image' loading='lazy' onClick={()=>navigate(`/pokemon/${poke.id}`)}/>
            <div className='pokemon-card-types'>{poke.types.map((type:pokemonTypeInterface,index:number)=>{
              const pokeType=Object.keys(type)
              console.log(type[pokeType[0]].image)
            return(
            <div className='pokemon-card-types-type' key={index}>
                <img className='pokemon-card-types-type-image' src={type[pokeType[0]].image} alt='poke Type' loading='lazy' />
                <h4 className='pokemon-card-types-type-text'>{pokeType[0]}</h4>
            </div>)}
            )}</div>
            </div>)
        }
        </div></div>
  )
}

export default PokemonCardGrid