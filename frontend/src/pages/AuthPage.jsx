import React from 'react'
import Login from '../components/Login'
import Hero from '../components/Hero'
import Footer from '../components/Footer'

const AuthPage = () => {
  return (
    <div className='min-h-screen flex flex-col'>
      {/* Main content area */}
      <div className='flex-1 flex flex-col lg:flex-row items-center justify-center px-4 py-8 lg:py-0'>
        {/* Hero section - hidden on mobile, shown on large screens */}
        <div className='hidden lg:flex lg:w-1/2 lg:justify-center lg:items-center lg:pr-8'>
          <Hero />
        </div>
        
        {/* Login section */}
        <div className='w-full lg:w-1/2 flex justify-center items-center'>
          <Login />
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}

export default AuthPage
