import React from 'react'
import pokeballIcon from '../assets/pokeball-icon.png'
import {GiHamburgerMenu} from 'react-icons/gi'
function Navbar() {
  const navigationRoutes=[
    {name:"Search",
    route:"/search"
    },
    {name:"Compare",
    route:"/compare"
    },
    {name:"Pokemon",
    route:"/pokemon"
    },
    {name:"My List",
    route:"/list"
    },
    {name:"About",
    route:"/about"
    },
  ]
  return (
    <nav className=''>
      <div className='block'><img src={pokeballIcon} alt='pokeball'/></div>
      <div className='block'>
        <div>SEARCH</div>
        <div>COMPARE</div>
        <div>POKEMON</div>
        <div>MY LIST</div>
        <div>ABOUT</div>
      </div>
      <div className='block'><GiHamburgerMenu/></div>
    </nav>
  )
}

export default Navbar