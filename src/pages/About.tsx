import React from 'react'
import Wrapper from '../sections/Wrapper'
import myPic from '../assets/akki.jpg'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
function About() {
  return (
    <div className="profile">
      <img src={myPic} alt='myimage' className='profile-image'/>
      <h1 className='profile-text'>Hi I am Akash Paul</h1>
      <h4 className="profile-text">My Portfolio is just right <a href='https://my-portfolio-akash-pauls-projects.vercel.app/'>HERE</a></h4>
      <div className="profile-links">
        <a href='https://github.com/akkipaul2000'><FaGithub/></a>
        <a href='https://www.linkedin.com/in/akash-paul-6a715a1b2/'><FaLinkedin/></a>
      </div>
    </div>
  )
}

export default Wrapper(About)