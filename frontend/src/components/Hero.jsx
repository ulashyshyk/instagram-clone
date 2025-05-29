import React from 'react'
import heroImage from '../assets/hero.jpeg'
const Hero = () => {
  return (
    <div>
      <img className='w-[500px] h-[600px] hidden lg:block rounded-xl' src={heroImage}/>
    </div>
  )
}

export default Hero
