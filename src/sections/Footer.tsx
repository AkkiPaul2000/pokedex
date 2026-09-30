import React, { useEffect } from 'react'
import {MdOutlinePowerSettingsNew} from 'react-icons/md'
import { motion } from 'framer-motion'
import { setPokemonTab } from '../app/slices/AppSlice'
import { pokemonTabs } from '../utils/Constant'
import { Link, useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { logout } from '../auth/Login'
import { spriteOf } from '../utils/pokemonImage'

const routes = [
  { name: pokemonTabs.description, value: "Description" },
  { name: pokemonTabs.evolution, value: "Evolution" },
  { name: pokemonTabs.locations, value: "Catching" },
  { name: pokemonTabs.moves, value: "Capable Moves" },
];

function Footer() {
  const { pathname } = useLocation()
  const dispatch = useAppDispatch()
  const currentPokemonTab = useAppSelector(({ app }) => app.currentPokemonTab)
  const userInfo = useAppSelector(({ app }) => app.userInfo)
  const recent = useAppSelector(({ pokemon }) => pokemon.recent)
  const hasTabs = pathname.startsWith("/pokemon")
  useEffect(() => {
    try { localStorage.setItem("recent", JSON.stringify(recent)) } catch {} // storage can be blocked
  }, [recent])
  return (
    <footer className={hasTabs ? 'has-tabs' : undefined}>
      <div className='block'></div>
      <div className='data'>
        {hasTabs ? (
        <ul>
          {routes.map((route) => (
            <li key={route.name}>
              <button onClick={() => dispatch(setPokemonTab(route.name))} aria-pressed={currentPokemonTab === route.name}>
                {currentPokemonTab === route.name && <motion.span layoutId='tab-pill' className='pill' transition={{ type: 'spring', stiffness: 500, damping: 40 }} />}
                <span>{route.value}</span>
              </button>
            </li>
          ))}
        </ul>
        ) : (
          // Elsewhere the bar keeps a trail of opened Pokémon to jump back to.
          <div className='recent'>
            <span className='recent-label'>{recent.length ? 'Recently seen' : 'Pokémon you open will show up here'}</span>
            {recent.map(({ id, name }) => (
              <Link key={id} to={`/pokemon/${id}`} title={name} aria-label={name}>
                <img src={spriteOf(id)} alt='' />
              </Link>
            ))}
          </div>
        )}
      </div>
      <div className='block'>
        {userInfo && <button className='logout' onClick={() => dispatch(logout())} title='Log out' aria-label='Log out'><MdOutlinePowerSettingsNew /></button>}
      </div>
    </footer>
  )
}

export default Footer
