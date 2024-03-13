import React from 'react'
import { pokemonTypeInterface } from '../utils/Types'
import { IoGitCompare } from "react-icons/io5";
import { useLocation, useNavigate } from 'react-router-dom';
import { FaPlus } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { useDispatch } from 'react-redux';
import { addToCompare } from '../app/slices/PokemonSlice';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { setToast } from '../app/slices/AppSlice';
import { addPokemonToList } from '../app/reducers/addPokemonToList';


function PokemonCardGrid({pokemons}:any) {
  const {toasts}=useAppSelector(({app})=>app);
  const location=useLocation();
  const navigate=useNavigate();
  const dispatch=useAppDispatch();
  return (
    <div className='pokemon-card-grid-container'><div className='pokemon-card-grid'>
        {pokemons && pokemons.length>0 && 
        pokemons.map((poke:any)=><div className='pokemon-card' key={poke.id}>
            <div className='pokemon-card-list'>
            {location.pathname.includes("/pokemon")|| location.pathname.includes("/search")?<FaPlus className="plus" onClick={()=>dispatch(addPokemonToList(poke))}/>:<FaTrash className='trash'/>}
            </div>
            <div className='pokemon-card-compare'>
              <IoGitCompare onClick={()=>{
                dispatch(addToCompare(poke));
                dispatch(setToast(`${poke.name}Has been added to Compare Queue`))
                }} /></div>
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