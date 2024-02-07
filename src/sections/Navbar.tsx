import React, { useEffect } from 'react'
import pokeballIcon from '../assets/pokeball-icon.png'
import {GiHamburgerMenu} from 'react-icons/gi'
import { Link } from 'react-router-dom'

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
  useEffect(()=>{
    const index=navigationRoutes.findIndex(({route})=>location.pathname.includes(route))
    ul(index)
  })
  function ul(number:number){
    const underline=document.querySelector<HTMLElement>(".underline")</HTMLElement>
  }
  return (
    <nav className=''>
      <div className='block'><img src={pokeballIcon} alt='pokeball'/></div>
      <div className='data'>
        <ul>
          <div className='.underline'>Ajbkjbdfkjbkj</div>
          <div className='.underline'>Ajbkjbdfkjbkj</div>
          <div className='.underline'>Ajbkjbdfkjbkj</div>
        {navigationRoutes.map(({name,route},index)=><Link to={route}><li>{name}</li></Link>)}
        </ul>
      </div>
      <div className='block'><GiHamburgerMenu/></div>
    </nav>
  )
}

export default Navbar