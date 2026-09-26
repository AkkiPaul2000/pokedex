import React, { useEffect, useState } from 'react'
import pokeballIcon from '../assets/pokeball-icon.png'
import {GiHamburgerMenu} from 'react-icons/gi'
import {IoClose} from 'react-icons/io5'
import { NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { login, logout } from '../auth/Login'

const navigationRoutes=[
  {name:"Search", route:"/search"},
  {name:"Compare", route:"/compare"},
  {name:"Pokemon", route:"/pokemon"},
  {name:"My List", route:"/list"},
  {name:"About", route:"/about"},
]

function Navbar() {
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector(({ app }) => app.userInfo);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => setMenuOpen(false), [pathname]);
  const current = navigationRoutes.find(({ route }) => pathname.startsWith(route));

  return (
    <nav>
      <div className='block'><img src={pokeballIcon} alt='Pokédex'/></div>
      <div className='data'>
        <ul className='links'>
          {navigationRoutes.map(({ name, route }) => (
            <li key={route}>
              <NavLink to={route}>
                {({ isActive }) => (
                  <>
                    {name}
                    {/* One shared layoutId: framer slides the underline from the old link to the new one. */}
                    {isActive && <motion.span layoutId='nav-underline' className='underline' transition={{ type: 'spring', stiffness: 500, damping: 40 }} />}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
        <span className='current'>{current?.name ?? 'Pokédex'}</span>
      </div>
      <div className='block'>
        <button className='menu-toggle' aria-label='Menu' aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <IoClose /> : <GiHamburgerMenu />}
        </button>
      </div>
      <AnimatePresence>
        {menuOpen && (
          <motion.ul
            className='mobile-menu'
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
          >
            {navigationRoutes.map(({ name, route }) => (
              <li key={route}><NavLink to={route}>{name}</NavLink></li>
            ))}
            <li>
              <button onClick={() => dispatch(userInfo ? logout() : login())}>
                {userInfo ? 'Log out' : 'Log in with Google'}
              </button>
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
