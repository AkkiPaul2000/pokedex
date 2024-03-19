import React from 'react'
import pokeballIcon from '../assets/pokeball-icon.png'
import {MdOutlinePowerSettingsNew} from 'react-icons/md'
import { signOut } from 'firebase/auth'
import { firebaseAuth } from '../utils/FirebaseConfig'
import { useDispatch } from 'react-redux'
import { setPokemonTab, setToast, setUserStatus } from '../app/slices/AppSlice'
import { pokemonTabs } from '../utils/Constant'
import { useLocation } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'

function Footer() {
  const location=useLocation()
  const dispatch=useDispatch()
  const currentPokemonTab=useAppSelector(({app:{currentPokemonTab}})=>currentPokemonTab)
  const handleLogOut=()=>{
    signOut(firebaseAuth)
    dispatch(setUserStatus(undefined))
    dispatch(setToast("Logged out successfully!!"))
  }
  const routes = [
    {
      name: pokemonTabs.description,
      value: "Description",
    },
    {
      name: pokemonTabs.evolution,
      value: "Evolution",
    },
    {
      name: pokemonTabs.locations,
      value: "Catching",
    },
    {
      name: pokemonTabs.moves,
      value: "Capable Moves",
    },
  ];
  return (
    <footer>
      <div className='block'></div>
      <div className='data'>
        {location.pathname.includes("/pokemon") &&
        <ul>
        {routes.map((route)=><li key={route.name} className={`${currentPokemonTab==route.name?"active":""}`} onClick={()=>{dispatch(setPokemonTab(route.name))}}>{route.value}</li>)}
        </ul>}
      </div>
      <div className='block'><MdOutlinePowerSettingsNew onClick={handleLogOut}/></div>
    </footer>
  )
}

export default Footer