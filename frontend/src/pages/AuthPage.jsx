import React from 'react'
import Login from '../components/Login'
import Hero from '../components/Hero'
import Footer from '../components/Footer'
const AuthPage = () => {
  return (
    <div className='flex flex-col items-center overflow-x-hidden'>
      <div className='flex flex-row items-center justify-center h-[100vh]'>
        <Hero />
        <Login />
      </div>   
      <Footer />   
    </div>
  )
}

export default AuthPage
