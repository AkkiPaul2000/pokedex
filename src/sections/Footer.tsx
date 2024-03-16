import React from 'react'
import pokeballIcon from '../assets/pokeball-icon.png'
import {MdOutlinePowerSettingsNew} from 'react-icons/md'
import { signOut } from 'firebase/auth'
import { firebaseAuth } from '../utils/FirebaseConfig'
import { useDispatch } from 'react-redux'
import { setToast, setUserStatus } from '../app/slices/AppSlice'

function Footer() {
  const dispatch=useDispatch()
  const handleLogOut=()=>{
    signOut(firebaseAuth)
    dispatch(setUserStatus(undefined))
    dispatch(setToast("Logged out successfully!!"))
  }
  return (
    <footer>
      <div className='block'></div>
      <div className='block'></div>
      <div className='block'><MdOutlinePowerSettingsNew onClick={handleLogOut}/></div>
    </footer>
  )
}

export default Footer